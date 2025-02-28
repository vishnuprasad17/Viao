import { inject, injectable } from "inversify";
import { AdminUseCase, AnalyticsResponse } from "../../domain/interfaces/application interfaces/AdminUseCase";
import TYPES from "../../domain/constants/inversifyTypes";
import { AdminRepository } from "../../domain/interfaces/infrastructure interfaces/AdminRepository";
import { UserRepository } from "../../domain/interfaces/infrastructure interfaces/UserRepository";
import { VendorRepository } from "../../domain/interfaces/infrastructure interfaces/VendorRepository";
import { BookingRepository } from "../../domain/interfaces/infrastructure interfaces/BookingRepository";
import { BaseError } from "../../domain/errors/BaseError";
import { AdminDTO } from "../../domain/dtos/AdminDTO";
import { PaymentRepository } from "../../domain/interfaces/infrastructure interfaces/PaymentRepository";
import { getCurrentWeekRange, getCurrentYearRange, getLastFiveYearsRange } from "../../domain/helpers/helperFunctions";

@injectable()
export class AdminUseCaseImpl implements AdminUseCase {
    constructor(@inject(TYPES.AdminRepository) private adminRepository: AdminRepository,
                @inject(TYPES.UserRepository) private userRepository: UserRepository,
                @inject(TYPES.VendorRepository) private vendorRepository: VendorRepository,
                @inject(TYPES.BookingRepository) private bookingRepository: BookingRepository,
                @inject(TYPES.PaymentRepository) private paymentRepository: PaymentRepository) {}

    async getData(adminId: string): Promise<AdminDTO> {
        const admin = await this.adminRepository.getById(adminId);
        if (!admin) {
            throw new BaseError("Admin not found.", 404);
        }
        const adminDto = AdminDTO.fromDomain(admin);
        
        return adminDto;
      }

    async analytics(dateType: string): Promise<AnalyticsResponse | null> {
        let start,
            end,
            groupBy,
            sortField,
            arrayLength = 0;
    
        switch (dateType) {
          case "week":
            const { startOfWeek, endOfWeek } = getCurrentWeekRange();
            start = startOfWeek;
            end = endOfWeek;
            groupBy = { day: { $isoDayOfWeek: "$createdAt" } }; // Group by day
            sortField = "day"; // Sort by day
            arrayLength = 7;
            break;
          case "month":
            const { startOfYear, endOfYear } = getCurrentYearRange();
            start = startOfYear;
            end = endOfYear;
            groupBy = { month: { $month: "$createdAt" } }; // Group by month
            sortField = "month"; // Sort by month
            arrayLength = 12;
            break;
          case "year":
            const { startOfFiveYearsAgo, endOfCurrentYear } = getLastFiveYearsRange();
            start = startOfFiveYearsAgo;
            end = endOfCurrentYear;
            groupBy = { year: { $year: "$createdAt" } }; // Group by year
            sortField = "year"; // Sort by year
            arrayLength = 5;
            break;
          default:
            return null;
        }
    
        const revenueData = await this.paymentRepository.getAdminRevenueDetails(start, end, groupBy, sortField);
        const revenueArray = Array.from({ length: arrayLength }, (_, index) => {
        const item = revenueData.find((r) => {
            if (dateType === "week") {
              return r._id.day === index + 1;
            } else if (dateType === "month") {
              return r._id.month === index + 1;
            } else if (dateType === "year") {
              return (
                r._id.year ===
                new Date().getFullYear() - (arrayLength - 1) + index
              );
            }
            return false;
        });
        return item ? item.totalRevenue : 0; // Default to 0 if no data for the expected index
        });

        const users = await this.userRepository.countDocuments();
        const vendors = await this.vendorRepository.countDocuments();
        const bookings = await this.bookingRepository.countDocuments();

        const response: AnalyticsResponse = {
          totalUsers: users,
          totalVendors: vendors,
          totalBookings: bookings,
          revenueArray: revenueArray
        }
    
        return response;
    }
}