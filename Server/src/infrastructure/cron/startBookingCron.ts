import cron from "node-cron";
import { container } from "../config/container";
import { BookingUseCase } from "../../domain/interfaces/application interfaces/BookingUseCase";
import TYPES from "../../domain/constants/inversifyTypes";

let isAutoFailRunning = false;

export const startBookingCron = () => {
  cron.schedule("* * * * *", async () => {
    if (isAutoFailRunning) {
      console.log("[Cron] Previous auto-fail job still running. Skipping this run.");
      return;
    }

    isAutoFailRunning = true;
    const start = Date.now();

    try {
      const bookingUseCase = container.get<BookingUseCase>(TYPES.BookingUseCase);

      const failedCount = await bookingUseCase.autoFailExpiredBookings();
        
      const duration = Date.now() - start;

      console.log(`[Cron] Completed in ${duration}ms`);  

      if (failedCount > 0) {
        console.log(`[Cron] Auto-failed ${failedCount} expired booking(s).`);
      }
    } catch (err) {
      console.error("[Cron] Error running auto-fail job:", err);
    } finally {
      isAutoFailRunning = false;
    }
  });

  console.log("[Cron] Booking auto-fail job scheduled (every minute).");
};