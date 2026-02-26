import { AdminRepository } from "../../../domain/interfaces/infrastructure interfaces/AdminRepository";
import { BaseRepository } from "./BaseRepository";
import { AdminModel, IAdmin } from "../mongooseModels/Admin";
import { mapToDomain, mapToDatabase } from "../mappers/adminMapper";
import { Admin } from "../../../domain/entities/Admin";
import { injectable } from "inversify";
import { BaseError } from "../../../domain/errors/BaseError";

@injectable()
export class AdminRepositoryImpl extends BaseRepository<IAdmin, Admin> implements AdminRepository {
  constructor(){
    super(AdminModel)
  }

  // Implement mapping methods
  protected toDomain(document: IAdmin): Admin {
    return mapToDomain(document);
  }

  protected toDatabase(domain: Admin, password?: string): Partial<IAdmin> {
    return mapToDatabase(domain, password);
  }

  async getPwdById(id: string): Promise<string | null> {
      const admin = await AdminModel.findById(id);
      return admin ? admin.password : null;
  }

  async updateWallet(amount: number): Promise<boolean> {
    let AdminData=await AdminModel.findOne({});
    if (AdminData) {
      AdminData.wallet += amount;
      await AdminData.save();
    }
    return AdminData? true : false;
  }

  async refundFromWallet(amount: number): Promise<boolean> {
    let AdminData=await AdminModel.findOne({});
    if (AdminData && amount > 0 && AdminData.wallet >= amount) {
      AdminData.wallet -= amount;
      await AdminData.save();

      return true;
    }
    
    return false;
  }

  // ==================== TOKEN MANAGEMENT METHODS ====================
  
      async storeRefreshToken(
          adminId: string, 
          sessionId: string, 
          token: string, 
          tokenFamily: string
      ): Promise<void> {
          try {
              await AdminModel.findByIdAndUpdate(
                  adminId,
                  {
                      $push: {
                          refreshTokens: {
                              sessionId,
                              token,
                              tokenFamily,
                              createdAt: new Date()
                          }
                      }
                  }
              );
          } catch (error) {
              console.error('Error storing refresh token:', error);
              throw new BaseError('Failed to store refresh token', 500);
          }
      }
  
      async getRefreshToken(adminId: string, sessionId: string): Promise<string | null> {
          try {
              const admin = await AdminModel.findOne(
                  { 
                      _id: adminId, 
                      'refreshTokens.sessionId': sessionId 
                  },
                  { 'refreshTokens.$': 1 }
              ).lean();
  
              return admin?.refreshTokens?.[0]?.token || null;
          } catch (error) {
              console.error('Error getting refresh token:', error);
              return null;
          }
      }
  
      async updateRefreshToken(
          adminId: string, 
          sessionId: string, 
          newToken: string
      ): Promise<void> {
          try {
              await AdminModel.updateOne(
                  { 
                      _id: adminId, 
                      'refreshTokens.sessionId': sessionId 
                  },
                  { 
                      $set: { 
                          'refreshTokens.$.token': newToken,
                          'refreshTokens.$.createdAt': new Date()
                      } 
                  }
              );
          } catch (error) {
              console.error('Error updating refresh token:', error);
              throw new BaseError('Failed to update refresh token', 500);
          }
      }
  
      async deleteRefreshToken(adminId: string, sessionId: string): Promise<number> {
          try {
              const result = await AdminModel.updateOne(
                  { _id: adminId },
                  { 
                      $pull: { 
                          refreshTokens: { sessionId } 
                      } 
                  }
              );
              
              return result.modifiedCount;
          } catch (error) {
              console.error('Error deleting refresh token:', error);
              return 0;
          }
      }
  
      async invalidateAllRefreshTokens(adminId: string): Promise<void> {
          try {
              await AdminModel.findByIdAndUpdate(
                  adminId,
                  { $set: { refreshTokens: [] } }
              );
              console.log(`Invalidated all refresh tokens for admin: ${adminId}`);
          } catch (error) {
              console.error('Error invalidating all refresh tokens:', error);
              throw new BaseError('Failed to invalidate refresh tokens', 500);
          }
      }
  
      async invalidateTokenFamily(adminId: string, tokenFamily: string): Promise<void> {
          try {
              const result = await AdminModel.updateOne(
                  { _id: adminId },
                  { 
                      $pull: { 
                          refreshTokens: { tokenFamily } 
                      } 
                  }
              );
              
              console.warn(`SECURITY: Invalidated token family ${tokenFamily} for admin ${adminId}`);
              console.warn(`Tokens removed: ${result.modifiedCount > 0 ? 'Yes' : 'No'}`);
          } catch (error) {
              console.error('Error invalidating token family:', error);
              throw new BaseError('Failed to invalidate token family', 500);
          }
      }
  
      async cleanupExpiredTokens(adminId: string): Promise<void> {
          try {
              const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              
              await AdminModel.updateOne(
                  { _id: adminId },
                  { 
                      $pull: { 
                          refreshTokens: { 
                              createdAt: { $lt: sevenDaysAgo } 
                          } 
                      } 
                  }
              );
          } catch (error) {
              console.error('Error cleaning up expired tokens:', error);
          }
      }
  
      async getActiveSessionCount(adminId: string): Promise<number> {
          try {
              const admin = await AdminModel.findById(adminId).select('refreshTokens').lean();
              return admin?.refreshTokens?.length || 0;
          } catch (error) {
              console.error('Error getting active session count:', error);
              return 0;
          }
      }
}