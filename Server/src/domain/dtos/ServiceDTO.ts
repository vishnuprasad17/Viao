import { Service } from "../entities/Service";

export class ServiceDTO {
    id: string;
    vendorId: string;
    name: String;
    price: number;
  
    constructor(service: Service) {
        this.id = service.id;
        this.vendorId = service.vendorId;
        this.name = service.name;
        this.price = service.price;
    }
  
    static fromDomain(service: Service): ServiceDTO {
      return new ServiceDTO(service);
    }
  
    static fromDomainList(services: Service[]): ServiceDTO[] {
      return services.map(service => new ServiceDTO(service));
    }
  }