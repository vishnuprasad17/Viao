import { Request, Response,} from "express";
import vendorTypeService from "../services/type.service";
import { errorHandler } from "../../../shared/utils/error.handler";


class VendorTypeController {

    async getVendorTypes(req: Request, res: Response): Promise<void> {
        try {
          const vendorTypes = await vendorTypeService.getTypes();
          console.log(vendorTypes); // Check the structure in the console
          res.status(200).json(vendorTypes);
        } catch (error) {
          errorHandler(res, error, "getVendorTypes");
        }
      }
}

export default new VendorTypeController();