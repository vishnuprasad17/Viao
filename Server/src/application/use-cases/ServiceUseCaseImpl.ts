import { inject, injectable } from "inversify";
import { ServiceCreateData, ServiceUpdateData, ServiceUseCase } from "../../domain/interfaces/application interfaces/ServiceUseCase";
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

    async create(vendorId: string, data: ServiceCreateData): Promise<boolean> {
        const vendorData = await this.vendorRepository.getById(vendorId);
        if (!vendorData) {
            return false;
        }
        const service = new Service(
            "",
            vendorId,
            data.name,
            data.price,
            data.advancePercentage ?? 100,
            data.minimumBookingNoticeInDays ?? 1,
            data.cancellationFullRefundBeforeDays ?? 7,
            data.cancellationPartialRefundBeforeDays ?? null,
            data.partialRefundPercentage ?? null
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

    async updateService(id: string, data: ServiceUpdateData): Promise<ServiceDTO | null> {
        const existing = await this.serviceRepository.getById(id);
        if (!existing) return null;

        existing.updateFields({
          name: data.name ?? existing.name,
          price: data.price ?? existing.price,
          advancePercentage: data.advancePercentage ?? existing.advancePercentage,
          minimumBookingNoticeInDays:
            data.minimumBookingNoticeInDays ?? existing.minimumBookingNoticeInDays,
          cancellationFullRefundBeforeDays:
            data.cancellationFullRefundBeforeDays ?? existing.cancellationFullRefundBeforeDays,
          cancellationPartialRefundBeforeDays:
            data.cancellationPartialRefundBeforeDays !== undefined
             ? data.cancellationPartialRefundBeforeDays
             : existing.cancellationPartialRefundBeforeDays,
          partialRefundPercentage:
            data.partialRefundPercentage !== undefined
             ? data.partialRefundPercentage
             : existing.partialRefundPercentage,
        });

        const serviceData = await this.serviceRepository.update(id, existing);
        if (!serviceData) {
            throw new BaseError("Service not found.", 404);
        }

        return ServiceDTO.fromDomain(serviceData);
    }

    async deleteService(id: string): Promise<boolean> {
        const deleted = await this.serviceRepository.delete(id);
        return !!deleted;
    }
}