import { VendorType } from "../../entities/VendorType";

export interface TypeRepository {
    create(vendortype: VendorType): Promise<VendorType>;
    getAll():Promise<VendorType[]>;
    delete(id:string):Promise<VendorType|null>;
    findOne(condition: Record<string, unknown>): Promise<VendorType | null>;
    update(id: string, user: Partial<VendorType>): Promise<VendorType | null>;
    findByType(type: string): Promise<VendorType | null>;
}