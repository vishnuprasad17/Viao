import { inject, injectable } from "inversify";
import { ServiceUseCase } from "../../domain/interfaces/application interfaces/ServiceUseCase";
import TYPES from "../../domain/constants/inversifyTypes";
import { VendorRepository } from "../../domain/interfaces/infrastructure interfaces/VendorRepository";
import { BaseError } from "../../domain/errors/BaseError";
import { Service } from "../../domain/entities/Service";
import { ServiceRepository } from "../../domain/interfaces/infrastructure interfaces/ServiceRepository";
import { ServiceDTO } from "../../domain/dtos/ServiceDTO";

@injectable()
export class ServiceUseCaseImpl implements ServiceUseCase {
    constructor(@inject(TYPES.ServiceRepository) private serviceRepository: ServiceRepository,
                @inject(TYPES.VendorRepository) private vendorRepository: VendorRepository) {}

    async create(vendorId: string, name: string, price: number): Promise<boolean> {
        const vendorData = await this.vendorRepository.getById(vendorId);
        if (!vendorData) {
            return false;
        }
        const service = new Service(
            "",
            vendorId,
            name,
            price
        );
        await this.serviceRepository.create(service);

        return true;
    }

    async getServicesByVendor(vendorId: string,page: number, pageSize: number): Promise<{ services: ServiceDTO[], totalPages: number }> {
        const { services, count } = await this.serviceRepository.getServicesByVendorId(vendorId, page, pageSize);
        const totalPages = Math.ceil(count / pageSize);
        const serviceDtos = ServiceDTO.fromDomainList(services);
    
        return { services: serviceDtos, totalPages: totalPages };
    }

    async getServicesForProfile(vendorId: string): Promise<ServiceDTO[]> {
        const services = await this.serviceRepository.getServicesForVendorProfile(vendorId);
        const serviceDtos = ServiceDTO.fromDomainList(services);
    
        return serviceDtos;
    }

    async updateService(id: string, name: string, price: number): Promise<ServiceDTO | null> {
        const existing = await this.serviceRepository.getById(id);
        if (price) {
            console.log(price);
        }
        if (!existing) {
            return null;
        }
        const update = {
            name: name || existing.name,
            price: price || existing.price,
        };
        
        existing.updateFields(update);
        const serviceData = await this.serviceRepository.update(id, existing);
        if (!serviceData) {
            throw new BaseError("Review not found.", 404);
        }

        return ServiceDTO.fromDomain(serviceData);
    }

    async deleteService(id: string): Promise<boolean> {
        const deletedService = await this.serviceRepository.delete(id);
        if (!deletedService) {
            return false;
        }
              
        return true;
    }
}