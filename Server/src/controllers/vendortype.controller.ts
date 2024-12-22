import { Request, Response,} from "express";
import vendorTypeService from "../services/type.service";
import { asyncHandler } from "../shared/middlewares/async-handler";


class VendorTypeController {

  getVendorTypes = asyncHandler("getVendorTypes")(async (req: Request, res: Response): Promise<void> => {
          const vendorTypes = await vendorTypeService.getTypes();
          console.log(vendorTypes); // Check the structure in the console
          res.status(200).json(vendorTypes);
        
      })
}

export default new VendorTypeController();