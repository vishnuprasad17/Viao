import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { TypeRepository } from "../../domain/interfaces/infrastructure interfaces/TypeRepository";
import { BaseError } from "../../domain/errors/BaseError";
import { VendorType } from "../../domain/entities/VendorType";
import { UploadService } from "../../domain/interfaces/application interfaces/UploadService";
import { TypeUseCase } from "../../domain/interfaces/application interfaces/TypeUseCase";
import { VendorTypeDTO } from "../../domain/dtos/VendorTypeDTO";


@injectable()
export class TypeUseCaseImpl implements TypeUseCase {
    constructor(@inject(TYPES.TypeRepository) private typeRepository: TypeRepository,
                @inject(TYPES.UploadService) private uploadService: UploadService) {}

    async addType(type: string, file: Express.Multer.File | undefined): Promise<{ message: string, new_type: VendorTypeDTO}> {
        const existingType = await this.typeRepository.findByType(type);
        if (existingType) {
            throw new BaseError("Type already exist!", 401);
        }
        let image = "";
        let imageUrl = "";
        if (file) {
            const data = await this.uploadService.uploadType(file);
            image = data.image;
            imageUrl = data.imageUrl;
        }
        const vendortype = new VendorType(
          "",
          type,
          true,
          image,
          imageUrl
        )
        const newVendorType = await this.typeRepository.create(vendortype);
        const new_type = VendorTypeDTO.fromDomain(newVendorType);

        return { message: "New Type added...", new_type };
    }

    async getTypes(): Promise<VendorTypeDTO[]> {
        const availableTypes = await this.typeRepository.getAll();
        const typeDtos = VendorTypeDTO.fromDomainList(availableTypes);
        return typeDtos;
    }

    async deleteType(id: string): Promise<VendorTypeDTO> {
        const deleted = await this.typeRepository.delete(id);
        if (!deleted) {
            throw new BaseError("Type not found to delete!", 404);
        }
        const deletedDto = VendorTypeDTO.fromDomain(deleted);

        return deletedDto;
    }

    async getSingleType(id: string): Promise<VendorTypeDTO> {
        const type= await this.typeRepository.findOne({ _id: id });
        if (!type) {
            throw new BaseError("Vendor type not found.", 404)
        }
        const vendorType = VendorTypeDTO.fromDomain(type);
        return vendorType;
    }

    async update(id: string, type: string, status: string, file: Express.Multer.File | undefined): Promise<VendorTypeDTO> {
        const vendorType=await this.typeRepository.findOne({_id:id});
        if (!vendorType) {
            throw new BaseError("Vendor type not found.", 404)
        }
        let image=vendorType.image;
        let imageUrl=vendorType.imageUrl;
          if(file){
            const data = await this.uploadService.uploadType(file);
            image = data.image;
            imageUrl = data.imageUrl;
          }
    
        const vendortype = new VendorType(
          id,
          type,
          status === "Active" ? true : false,
          image,
          imageUrl
          )
        const updated = await this.typeRepository.update(id, vendortype);
        if (!updated) {
            throw new BaseError("Failed to update vendor type.", 500);
        }
        const updatedType = VendorTypeDTO.fromDomain(updated);
        return updatedType;
    }
}