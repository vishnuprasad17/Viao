import { Service } from "../entities/Service";

export class ServiceDTO {
  constructor(
    public id: string,
    public vendorId: string,
    public name: string,
    public price: number,
    public advancePercentage: number,
    public minimumBookingNoticeInDays: number,
    public cancellationFullRefundBeforeDays: number,
    public cancellationPartialRefundBeforeDays: number | null,
    public partialRefundPercentage: number | null,
    public advanceAmount: number,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static fromDomain(service: Service): ServiceDTO {
    return new ServiceDTO(
      service.id,
      service.vendorId,
      service.name,
      service.price,
      service.advancePercentage,
      service.minimumBookingNoticeInDays,
      service.cancellationFullRefundBeforeDays,
      service.cancellationPartialRefundBeforeDays,
      service.partialRefundPercentage,
      service.getAdvanceAmount(),
      service.createdAt,
      service.updatedAt
    );
  }

  static fromDomainList(services: Service[]): ServiceDTO[] {
    return services.map(ServiceDTO.fromDomain);
  }
}