import cron from "node-cron";
import { VendorModel } from "../odm/mongooseModels/Vendor";

export const cleanExpiredBookedDates = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running cleanup for bookedDates...");

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

      // Update vendors and remove past dates
      const result = await VendorModel.updateMany(
        {},
        { $pull: { bookedDates: { $lt: today.toISOString() } } }
      );
      console.log(`Cleaned ${result.modifiedCount} bookedDates`);
    } catch (error) {
      console.error("Error cleaning bookedDates: ", error);
    }
  });
};