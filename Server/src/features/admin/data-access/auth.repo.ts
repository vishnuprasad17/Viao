import Admin from "../models/admin.model";
import { IAdminDocument } from "../interfaces/model.interface";
import { BaseRepository } from "../../../shared/data-access/base.repo";

class AdminRepository extends BaseRepository<IAdminDocument>{
  constructor() {
    super(Admin);
  }
  async findByEmail (email: string): Promise<IAdminDocument | null> {
  return await Admin.findOne({ email });
  }
};

export default new AdminRepository();