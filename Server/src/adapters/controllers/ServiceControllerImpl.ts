import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ServiceController } from "../../domain/interfaces/adapter interfaces/ServiceController";
import TYPES from "../../domain/constants/inversifyTypes";
import { ServiceUseCase } from "../../domain/interfaces/application interfaces/ServiceUseCase";
import { asyncHandler } from "../middlewares/async-handler";

@injectable()
export class ServiceControllerImpl implements ServiceController {
    constructor(@inject(TYPES.ServiceUseCase) private serviceUseCase: ServiceUseCase) {}

    createService = asyncHandler("CreateAService")(async(req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.body.vendorId as string;
        const name: string = req.body.name as string;
        const price: number = req.body.price as number;
        const status = await this.serviceUseCase.create(vendorId, name, price);

        if (!status) {
            res
              .status(400)
              .json({ error: `couldn't add service, some error occured` });
            return;
        }
        res.status(200).json({ message: "service added successfully.." });
    });

    updateService = asyncHandler("UpdateService")(async(req: Request, res: Response): Promise<void> => {
        const serviceId = req.query.serviceId as string;
        const { name, price } = req.body;
        const updated = await this.serviceUseCase.updateService(serviceId, name, price);

        if (!updated) {
        res.status(404).json({ message: "Service not found" });
        return;
        }

        res.status(200).json({updatedService: updated});
    });

    getServices = asyncHandler("GetServices")(async(req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.query.vendorId as string;
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 9;
        const { services, totalPages } = await this.serviceUseCase.getServicesByVendor(vendorId,page,pageSize);

        res.status(200).json({services,totalPages});
    });

    getAllServices = asyncHandler("GetAllServices")(async(req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.query.vendorId as string;
        const services = await this.serviceUseCase.getServicesForProfile(vendorId);

        res.status(200).json({services});
    });

    deleteService = asyncHandler("DeleteService")(async(req: Request, res: Response): Promise<void> => {
        const serviceId: string = req.query.serviceId as string;
        const deleted = await this.serviceUseCase.deleteService(serviceId);

        if (!deleted) {
          res.status(404).json({ message: "Review not found." });
          return;
        }
        res.status(200).json({ message: "Review deleted successfully!" });
    });
}