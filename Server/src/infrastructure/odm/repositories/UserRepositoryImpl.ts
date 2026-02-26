import { UserRepository } from "../../../domain/interfaces/infrastructure interfaces/UserRepository";
import { BaseRepository } from "./BaseRepository";
import { UserModel, IUser} from "../mongooseModels/User";
import { mapToDatabase, mapToDomain } from "../mappers/userMapper";
import { User } from "../../../domain/entities/User";
import { injectable } from "inversify";
import { BaseError } from "../../../domain/errors/BaseError";

@injectable()
export class UserRepositoryImpl extends BaseRepository<IUser, User> implements UserRepository {
  constructor() {
    super(UserModel);
  }

  // Implement mapping methods
  protected toDomain(document: IUser): User {
    return mapToDomain(document);
  }

  protected toDatabase(domain: User, password?: string): Partial<IUser> {
    return mapToDatabase(domain, password);
  }

  async getPwdById(id: string){
    const user = await UserModel.findById(id);
    return user ? user.password : null;
  }

  async updatePassword(password: string, mail: string) {
      try {
        const result = await UserModel.updateOne(
          { email: mail },
          { password: password }
        );
        if (result.modifiedCount === 1) {
          return { success: true, message: "Password updated successfully." };
        } else {
          return {
            success: false,
            message: "User not found or password not updated.",
          };
        }
      } catch (error) {
        throw error;
      }
    }
  
    async deleteFavVendor(userId: string, vendorId: string) {
      const data = await UserModel.findByIdAndUpdate(
          userId,
          { $pull: { favourite: vendorId } },
          { returnDocument: "after" }
        );

        return data ? this.toDomain(data) : null;
        
    }
  
    async findAllUsers(
      page: number,
      limit: number,
      search: string
    ) {
      try {
        const query = search ? { name: { $regex: new RegExp(search, "i") } } : {};
        const users = await UserModel.find(query)
          .skip((page - 1) * limit)
          .limit(limit);
  
        return users.map((user) => this.toDomain(user));
      } catch (error) {
        throw error;
      }
    }

    async addFavVendor(userId: string, vendorId: string) {
      try {
        const user = await UserModel.findByIdAndUpdate(
          userId,
          { $push: { favourite: vendorId } },
          { returnDocument: "after" }
        );
        return user ? this.toDomain(user) : null;
      } catch (error) {
        throw error;
      }
    }

    async refundToWallet(id: string, amount: number): Promise<boolean> {
      let UserData=await UserModel.findById(id);
      if (UserData) {
        UserData.wallet += amount;
        await UserData.save();
      }
      
      return UserData ? true : false;
    }

    async deductFromWallet(id: string, amount: number): Promise<boolean> {
      let UserData=await UserModel.findById(id);
      if (UserData) {
        UserData.wallet -= amount;
        await UserData.save();
      }
      return UserData? true : false;
    }

    // ==================== TOKEN MANAGEMENT METHODS ====================

    async storeRefreshToken(
        userId: string, 
        sessionId: string, 
        token: string, 
        tokenFamily: string
    ): Promise<void> {
        try {
            await UserModel.findByIdAndUpdate(
                userId,
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

    async getRefreshToken(userId: string, sessionId: string): Promise<string | null> {
        try {
            const user = await UserModel.findOne(
                { 
                    _id: userId, 
                    'refreshTokens.sessionId': sessionId 
                },
                { 'refreshTokens.$': 1 }
            ).lean();

            return user?.refreshTokens?.[0]?.token || null;
        } catch (error) {
            console.error('Error getting refresh token:', error);
            return null;
        }
    }

    async updateRefreshToken(
        userId: string, 
        sessionId: string, 
        newToken: string
    ): Promise<void> {
        try {
            await UserModel.updateOne(
                { 
                    _id: userId, 
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

    async deleteRefreshToken(userId: string, sessionId: string): Promise<number> {
        try {
            const result = await UserModel.updateOne(
                { _id: userId },
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

    async invalidateAllRefreshTokens(userId: string): Promise<void> {
        try {
            await UserModel.findByIdAndUpdate(
                userId,
                { $set: { refreshTokens: [] } }
            );
            console.log(`Invalidated all refresh tokens for user: ${userId}`);
        } catch (error) {
            console.error('Error invalidating all refresh tokens:', error);
            throw new BaseError('Failed to invalidate refresh tokens', 500);
        }
    }

    async invalidateTokenFamily(userId: string, tokenFamily: string): Promise<void> {
        try {
            const result = await UserModel.updateOne(
                { _id: userId },
                { 
                    $pull: { 
                        refreshTokens: { tokenFamily } 
                    } 
                }
            );
            
            console.warn(`SECURITY: Invalidated token family ${tokenFamily} for user ${userId}`);
            console.warn(`Tokens removed: ${result.modifiedCount > 0 ? 'Yes' : 'No'}`);
        } catch (error) {
            console.error('Error invalidating token family:', error);
            throw new BaseError('Failed to invalidate token family', 500);
        }
    }

    async cleanupExpiredTokens(userId: string): Promise<void> {
        try {
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            
            await UserModel.updateOne(
                { _id: userId },
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

    async getActiveSessionCount(userId: string): Promise<number> {
        try {
            const user = await UserModel.findById(userId).select('refreshTokens').lean();
            return user?.refreshTokens?.length || 0;
        } catch (error) {
            console.error('Error getting active session count:', error);
            return 0;
        }
    }
}