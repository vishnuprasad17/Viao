import { Service } from "../../entities/Service";

export interface ServiceRepository {
    create(service: Service): Promise<Service>;
    update(id: string, service: Partial<Service>): Promise<Service | null>;
    getById(id: string): Promise<Service | null>;
    delete(id:string):Promise<Service |null>;
    
    getServicesByVendorId(vendorId: string, page: number, pageSize: number): Promise<{ services: Service[], count: number}>;
    getServicesForVendorProfile(vendorId: string): Promise<Service[]>;
}