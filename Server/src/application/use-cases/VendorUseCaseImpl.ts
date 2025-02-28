import bcrypt from 'bcrypt';
import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { VendorRepository } from "../../domain/interfaces/infrastructure interfaces/VendorRepository";
import { AdminRepository } from "../../domain/interfaces/infrastructure interfaces/AdminRepository";
import { NotificationRepository } from "../../domain/interfaces/infrastructure interfaces/NotificationRepository";
import { BaseError } from "../../domain/errors/BaseError";
import { NotificationService } from "../../domain/interfaces/application interfaces/NotificationService";
import { UploadService } from "../../domain/interfaces/application interfaces/UploadService";
import { PasswordService } from '../../domain/interfaces/application interfaces/PasswordService';
import { Types } from '../../domain/constants/notificationTypes';
import { UserRepository } from '../../domain/interfaces/infrastructure interfaces/UserRepository';
import { PaymentRepository } from '../../domain/interfaces/infrastructure interfaces/PaymentRepository';
import { VendorDTO } from '../../domain/dtos/VendorDTO';
import { AnalyticsResponse, Suggestion, VendorUseCase } from '../../domain/interfaces/application interfaces/VendorUseCase';
import { ReviewRepository } from '../../domain/interfaces/infrastructure interfaces/ReviewRepository';
import { toTitleCase, getCurrentWeekRange, getCurrentYearRange, getLastFiveYearsRange } from '../../domain/helpers/helperFunctions';

injectable()
export class VendorUseCaseImpl implements VendorUseCase {
    constructor(@inject(TYPES.VendorRepository) private vendorRepository: VendorRepository,
                @inject(TYPES.UploadService) private uploadService: UploadService,
                @inject(TYPES.AdminRepository) private adminRepository: AdminRepository,
                @inject(TYPES.UserRepository) private userRepository: UserRepository,
                @inject(TYPES.PaymentRepository) private paymentRepository: PaymentRepository,
                @inject(TYPES.PasswordService) private passwordService: PasswordService,
                @inject(TYPES.NotificationRepository) private notificationRepository: NotificationRepository,
                @inject(TYPES.NotificationService) private notificationService: NotificationService,
                @inject(TYPES.ReviewRepository) private reviewRepository: ReviewRepository
                ) {}

    async getSingleVendor(vendorId: string): Promise<VendorDTO | null> {
        const vendorData = await this.vendorRepository.getById(vendorId);
        if (!vendorData) {
          return null;
        }

        return VendorDTO.fromDomain(vendorData);
    }

    async verificationRequest(vendorId: string): Promise<VendorDTO> {
          const data = await this.vendorRepository.requestForVerification(vendorId);
          if(!data) {
            throw new BaseError("Vendor not found", 404);
          }
    
          //Notification
          const Admin = await this.adminRepository.findOne({});
          if (!Admin) {
              throw new BaseError("Admin not found", 404);
          }
          const notificationType = Types.VERIFY
          const message = `${data.name} requested for verification!`
          const notificationData = await this.notificationService.createNotification(Admin.id, message, notificationType);
          await this.notificationRepository.create(notificationData);

          return VendorDTO.fromDomain(data);
      }

    async update(vendorId: string, data: any, files: { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[] | undefined): Promise<VendorDTO> {
          const existingVendor = await this.vendorRepository.getById(vendorId);
          if (!existingVendor) {
            throw new BaseError("Vendor not found", 404);
          }

          if (!existingVendor.isActive) {
            throw new BaseError("Can't perform action right now. Please refresh.", 401);
          }
          let coverpicFile="";
          let coverpicUrl = "";
          let logoFile="";
          let logoUrl = "";
          
          if (files) {
            const data = await this.uploadService.upload(files, "vendor"); // Upload the file

            if (typeof data !== "string") {
            coverpicFile = data.coverpicFile;
            coverpicUrl = data.coverpicUrl;
            logoFile = data.logoFile;
            logoUrl = data.logoUrl;
            }

          } else if(existingVendor.coverpic && existingVendor.coverpicUrl && existingVendor.logo && existingVendor.logoUrl) {
            coverpicFile = existingVendor.coverpic;
            coverpicUrl = existingVendor.coverpicUrl;
            logoFile = existingVendor.logo;
            logoUrl = existingVendor.logoUrl;
          }

          const update = {
                  name: data.name || existingVendor.name,
                  city: toTitleCase(data.city) || existingVendor.city,
                  phone: parseInt(data.phone) || existingVendor.phone,
                  coverpicUrl: coverpicUrl,
                  logoUrl: logoUrl,
                  logo: logoFile,
                  coverpic: coverpicFile,
                  about:data.about
                };
                
          existingVendor.updateFields(update);
          const updatedVendor = await this.vendorRepository.update(vendorId, existingVendor);
          if (!updatedVendor) {
            throw new BaseError("Failed to update vendor", 500);
          }
          return VendorDTO.fromDomain(updatedVendor);
      }
      
    async updatePwd(currentPassword: string, newPassword: string, vendorId: string): Promise<boolean> {
              const existingVendor = await this.vendorRepository.getById(vendorId);
              const password = await this.vendorRepository.getPwdById(vendorId);
                  if (!existingVendor || !password) {
                    throw new BaseError("Vendor not found", 404);
                  }
              
                  if(!existingVendor.isActive) {
                    throw new BaseError("Something went wrong. Please refresh.", 401);
                  }
                  const passwordMatch = await bcrypt.compare(
                    currentPassword,
                    password
                  );
                  if (!passwordMatch) {
                    throw new BaseError("Paswword doesn't match", 401);
                  }
                  const hashedPassword = await this.passwordService.hashPassword(newPassword);
                  const updatedValue = await this.vendorRepository.updateVendorPassword(
                    hashedPassword,
                    existingVendor.email
                  )
                  return updatedValue ? true : false;
      }

    async getBookedDates(vendorId: string): Promise<string[]> {
      const vendor = await this.vendorRepository.getById(vendorId);
      if (!vendor) {
        throw new BaseError("Vendor not found", 404);
      }
      return vendor.bookedDates;
    }

    async addDateAvailability(vendorId: string, status: string, date: string): Promise<string[]> {
            const data = await this.vendorRepository.changeDateAvailability(
              vendorId,
              status,
              date
            );
            if (!data) {
              throw new BaseError("Failed to update vendor date availability", 500);
            }
            return data;
        }

    async getVendors(page: number, limit: number, search: string, category: string, location: string, sortValue: number): Promise<{ vendorData: VendorDTO[], totalPages: number }> {
            const vendors = await this.vendorRepository.findAllVendors(
              page,
              limit,
              search,
              category,
              location,
              sortValue
            );
            const vendorDtos = VendorDTO.fromDomainList(vendors);
            const totalVendors = vendorDtos.length;
            const totalPages = Math.floor(totalVendors / limit);

            return { vendorData: vendorDtos, totalPages };
        }

      async getSuggestions(term: string): Promise<Suggestion[]> {
        const suggestions = await this.vendorRepository.getVendorSuggestions(term);
        if (term) {
          console.log(suggestions, "term: ", term);
        }

        return suggestions;
      }
      
        async toggleVendorBlock(vendorId: string): Promise<VendorDTO | null> {
            const vendor = await this.vendorRepository.getById(vendorId);
            if (!vendor) {
              throw new BaseError("Vendor not found.", 404);
            }

            const updatedVendor = await this.vendorRepository.block(vendorId, !vendor.isActive);
            if (!updatedVendor) {
              return null;
            }
            return VendorDTO.fromDomain(updatedVendor);
        }
    
        async changeVerifyStatus(vendorId: string, status: string, note?: string): Promise<VendorDTO> {
            const data = await this.vendorRepository.updateVerificationStatus(
              vendorId,
              status
            );
            if(!data) {
              throw new BaseError("Vendor not found.", 404);
            }
            const notificationType = status === "Rejected" ? Types.REJECTED : Types.VERIFIED;
            const message = status == "Accepted" ? `Your account has been Verified!` : `Verification Rejected! ${note}`;
            const notificationData = await this.notificationService.createNotification(data.id, message, notificationType)
            await this.notificationRepository.create(notificationData);
            return VendorDTO.fromDomain(data);
        }
    
        async getAllLocations(): Promise<string[]> {
            const data = await this.vendorRepository.findAllLocations();
            if (!data) {
              throw new BaseError("Failed to get locations", 500);
            }
            return data;
        }

        async FavoriteVendors(userid: string, page: number, pageSize: number): Promise<{ favVendors: VendorDTO[], count: number }> {
            const userData = await this.userRepository.getById(userid);
            if (!userData) {
              throw new BaseError("User not found", 404);
            }
            const favs = userData.favourite;
        
            if (!favs || favs.length === 0) {
              //throw new BaseError("No favorite vendors found for this user", 404);
            }
            const { favVendors, count } = await this.vendorRepository.getFavVendors(favs, page, pageSize);
            const vendorDtos = VendorDTO.fromDomainList(favVendors);

            return { favVendors: vendorDtos, count };
        }

        async analytics(vendorId: string, dateType: string): Promise<AnalyticsResponse | null> {
          const vendor = await this.vendorRepository.getById(vendorId);
          if (!vendor) {
            throw new BaseError("Vendor not found", 404);
          }
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
              const { startOfFiveYearsAgo, endOfCurrentYear } =
                getLastFiveYearsRange();
              start = startOfFiveYearsAgo;
              end = endOfCurrentYear;
              groupBy = { year: { $year: "$createdAt" } }; // Group by year
              sortField = "year"; // Sort by year
              arrayLength = 5;
              break;
            default:
              return null;
          }
    
          const revenueData = await this.paymentRepository.getVendorRevenueDetails(vendorId, start, end, groupBy, sortField);
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

          //Get reviews count of vendor
          const totalReviews = await this.reviewRepository.countDocuments({ vendorId: vendorId });

          const response: AnalyticsResponse = {
            totalBookings: vendor.totalBooking,
            totalRating: vendor.totalRating,
            totalReviews: totalReviews,
            revenueArray: revenueArray
          }

          return response;
        }
    
}