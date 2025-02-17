import { Vendor } from "../../entities/Vendor";

export interface VendorRepository {
  getById(id: string): Promise<Vendor | null>;
  create(vendor: Vendor, password: string): Promise<Vendor>;
  update(id: string, user: Partial<Vendor>): Promise<Vendor | null>;
  countDocuments(condition?:Record<string,unknown>):Promise<number>;
  block(id: string, status: boolean): Promise<Vendor | null>;
  findByEmail(email: string): Promise<Vendor | null>;
  findByPhone(phone:number): Promise<Vendor | null>;
  
  getPwdById(id: string): Promise<string | null>;
  updateVendorPassword(password: string, email: string): Promise<{ success: boolean; message: string }>;
  requestForVerification(vendorId: string): Promise<Vendor | null>;
  updateVerificationStatus(vendorId: string, status: string): Promise<Vendor | null>;
  changeDateAvailability(vendorId: string, status: string, date: string): Promise<string[] | undefined>;
  getFavVendors(favs: string[], page: number, pageSize: number): Promise<{ favVendors: Vendor[], count:number }>;
  findAllVendors(
    page: number,
    limit: number,
    search: string,
    category: string,
    location: string,
    sortValue: number
  ): Promise<Vendor[]>;
  findAllLocations(): Promise<string[]>;
  lockDate(id: string, date: string): Promise<boolean>;
  unlockDate(id: string, date: string): Promise<boolean>;
  bookDate(id: string, date: string): Promise<Vendor | null>;
  cancelDate(id: string, date: string): Promise<Vendor | null>;
  updateBookingCount(id: string): Promise<boolean>;
  updateRating(id: string, rating: number): Promise<boolean>;
}