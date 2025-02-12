import bcrypt from 'bcrypt';
import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { VendorRepository } from "../../domain/interfaces/VendorRepository";
import { Vendor } from "../../domain/entities/Vendor";
import { AdminRepository } from "../../domain/interfaces/AdminRepository";
import { NotificationRepository } from "../../domain/interfaces/NotificationRepository";
import { BaseError } from "../../domain/errors/BaseError";
import { NotificationService } from "../../domain/interfaces/NotificationService";
import { UploadService } from "../../domain/interfaces/UploadService";
import { PasswordService } from '../../domain/interfaces/PasswordService';
import { Types } from '../../domain/constants/notificationTypes';
import { UserRepository } from '../../domain/interfaces/UserRepository';

function toTitleCase(city: string): string {
  return city.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

injectable()
export class VendorUseCase {
    constructor(@inject(TYPES.VendorRepository) private vendorRepository: VendorRepository,
                @inject(TYPES.UploadService) private uploadService: UploadService,
                @inject(TYPES.AdminRepository) private adminRepository: AdminRepository,
                @inject(TYPES.UserRepository) private userRepository: UserRepository,
                @inject(TYPES.PasswordService) private passwordService: PasswordService,
                @inject(TYPES.NotificationRepository) private notificationRepository: NotificationRepository,
                @inject(TYPES.NotificationService) private notificationService: NotificationService,
                ) {}

    async getSingleVendor(vendorId: string): Promise<Vendor | null> {
        return await this.vendorRepository.getById(vendorId);
    }

    async verificationRequest(vendorId: string): Promise<Vendor> {
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
          return data;
      }

    async update(vendorId: string, data: any, files: { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[] | undefined) {
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
          return updatedVendor;
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

    async getVendors(page: number, limit: number, search: string, category: string, location: string, sortValue: number): Promise<Vendor[]> {
            const vendors = await this.vendorRepository.findAllVendors(
              page,
              limit,
              search,
              category,
              location,
              sortValue
            );
            return vendors;
        }
      
        async toggleVendorBlock(vendorId: string): Promise<Vendor | null> {
            const vendor = await this.vendorRepository.getById(vendorId);
            if (!vendor) {
              throw new BaseError("Vendor not found.", 404);
            }

            const updatedVendor = await this.vendorRepository.block(vendorId, !vendor.isActive);
            return updatedVendor;
        }
    
        async changeVerifyStatus(vendorId: string, status: string, note?: string): Promise<Vendor> {
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
            return data;
        }
    
        async getAllLocations(): Promise<string[]> {
            const data = await this.vendorRepository.findAllLocations();
            if (!data) {
              throw new BaseError("Failed to get locations", 500);
            }
            return data;
        }

        async FavoriteVendors(userid: string, page: number, pageSize: number) {
            const userData = await this.userRepository.getById(userid);
            if (!userData) {
              throw new BaseError("User not found", 404);
            }
            const favs = userData.favourite;
        
            if (!favs || favs.length === 0) {
              //throw new BaseError("No favorite vendors found for this user", 404);
            }
            const { favVendors, count } = await this.vendorRepository.getFavVendors(favs, page, pageSize);

            return { favVendors, count };
        }
    
}