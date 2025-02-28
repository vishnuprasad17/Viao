import { ServiceDTO } from "../../dtos/ServiceDTO";

export interface ServiceUseCase {
    create(vendorId: string, name: string, price: number): Promise<boolean>;
    getServicesByVendor(vendorId: string,page: number, pageSize: number): Promise<{ services: ServiceDTO[], totalPages: number }>;
    getServicesForProfile(vendorId: string): Promise<ServiceDTO[]>;
    updateService(id: string, name: string, price: number): Promise<ServiceDTO | null>;
    deleteService(id: string): Promise<boolean>;
}