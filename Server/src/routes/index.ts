import { Router } from "express";
import adminRouter from "./admin.routes";
import userRouter from "./user.routes";
import vendorRouter from "./vendor.routes";

const routes = Router();

routes.use("/admin", adminRouter)
routes.use("/user", userRouter);
routes.use("/vendor", vendorRouter);

export default routes;