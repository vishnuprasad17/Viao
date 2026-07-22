import { ServiceDTO } from "../../dtos/ServiceDTO";

export interface ServiceUseCase {
    create(vendorId: string, data: ServiceCreateData): Promise<boolean>;
    getServicesByVendor(vendorId: string,page: number, pageSize: number): Promise<{ services: ServiceDTO[], totalPages: number }>;
    getServicesForProfile(vendorId: string): Promise<ServiceDTO[]>;
    updateService(id: string, data: ServiceUpdateData): Promise<ServiceDTO | null>;
    deleteService(id: string): Promise<boolean>;
}

interface ServiceCreateData {
  name: string;
  price: number;
  advancePercentage: number;
  minimumBookingNoticeInDays: number;
  cancellationFullRefundBeforeDays: number;
  cancellationPartialRefundBeforeDays?: number | null;
  partialRefundPercentage?: number | null;
}

interface ServiceUpdateData {
  name?: string;
  price?: number;
  advancePercentage?: number;
  minimumBookingNoticeInDays?: number;
  cancellationFullRefundBeforeDays?: number;
  cancellationPartialRefundBeforeDays?: number | null;
  partialRefundPercentage?: number | null;
}

export { ServiceCreateData, ServiceUpdateData };