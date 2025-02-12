import { AdminRepository } from "../../../domain/interfaces/AdminRepository";
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
}