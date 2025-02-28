import { AdminRepository } from "../../../domain/interfaces/infrastructure interfaces/AdminRepository";
import { BaseRepository } from "./BaseRepository";
import { AdminModel, IAdmin } from "../mongooseModels/Admin";
import { mapToDomain, mapToDatabase } from "../mappers/adminMapper";
import { Admin } from "../../../domain/entities/Admin";
import { injectable } from "inversify";

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
}