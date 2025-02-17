import { TypeRepository } from "../../../domain/interfaces/infrastructure interfaces/TypeRepository";
import { BaseRepository } from "./BaseRepository";
import { VendorTypeModel, IVendorType } from "../mongooseModels/VendorType";
import { mapToDomain, mapToDatabase } from "../mappers/vendorTypeMapper";
import { VendorType } from "../../../domain/entities/VendorType";
import { injectable } from "inversify";

@injectable()
export class TypeRepositoryImpl extends BaseRepository<IVendorType, VendorType> implements TypeRepository {
  constructor(){
    super(VendorTypeModel)
  }

  // Implement mapping methods
  protected toDomain(document: IVendorType): VendorType {
    return mapToDomain(document);
  }

  protected toDatabase(domain: VendorType): Partial<IVendorType> {
    return mapToDatabase(domain);
  }

  async findByType(type:string): Promise<VendorType | null> {
      const data = await VendorTypeModel.findOne({type:type})
      return data ? this.toDomain(data) : null;
  }

}