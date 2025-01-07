import { Router } from "express";
import adminRouter from "./admin.routes";
import userRouter from "./user.routes";
import vendorRouter from "./vendor.routes";
import messageRouter from "./message.routes";
import chatRouter from "./conversation.routes";

const routes = Router();

routes.use("/admin", adminRouter)
routes.use("/user", userRouter);
routes.use("/vendor", vendorRouter);
routes.use("/message", messageRouter)
routes.use("/conversation",chatRouter)

export default routes;