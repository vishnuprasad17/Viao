import VendorType from "../models/vendortype.model";
import { IVendorType } from "../interfaces/vendortype.interface";
import { BaseRepository } from "../shared/data-access/base.repo";

class VendorTypeRepository extends BaseRepository<IVendorType> {
  constructor() {
    super(VendorType);
  }

  async findByType(type:string){
      return await VendorType.findOne({type:type})
    
  }
}

export default new VendorTypeRepository();