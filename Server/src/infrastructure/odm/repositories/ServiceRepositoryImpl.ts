import { ServiceRepository } from "../../../domain/interfaces/infrastructure interfaces/ServiceRepository";
import { BaseRepository } from "./BaseRepository";
import { ServiceModel, IService} from "../mongooseModels/Service";
import { mapToDatabase, mapToDomain } from "../mappers/serviceMapper";
import { injectable } from "inversify";
import { Service } from "../../../domain/entities/Service";

@injectable()
export class ServiceRepositoryImpl extends BaseRepository<IService, Service> implements ServiceRepository {
  constructor() {
    super(ServiceModel);
  }

  // Implement mapping methods
  protected toDomain(document: IService): Service {
    return mapToDomain(document);
  }

  protected toDatabase(domain: Service): Partial<IService> {
    return mapToDatabase(domain);
  }

  async getServicesByVendorId(vendorId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const documents = await ServiceModel.find({ vendorId: vendorId })
        .skip(skip)
        .limit(pageSize);
  
    const count = await ServiceModel.countDocuments({ vendorId: vendorId });
    const services = documents.map((document) => this.toDomain(document));

    return { services, count };
  };

  async getServicesForVendorProfile(vendorId: string) {
    const services = await ServiceModel.find({ vendorId: vendorId });

    return services.map((service) => this.toDomain(service));
  };
}