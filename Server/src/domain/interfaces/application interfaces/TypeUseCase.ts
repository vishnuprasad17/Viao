import { VendorTypeDTO } from "../dtos/VendorTypeDTO";
import { VendorType } from "../entities/VendorType";

export interface TypeUseCase {
    addType(type: String, file: Express.Multer.File | undefined): Promise<{ message: string, new_type: VendorTypeDTO}>;
    getTypes():Promise<VendorTypeDTO[]>;
    deleteType(id: string): Promise<VendorTypeDTO>;
    getSingleType(id: string): Promise<VendorTypeDTO>;
    update(id: string, type: string, status: string, file: Express.Multer.File | undefined): Promise<VendorTypeDTO>;
}