import { VendorDTO } from "../../dtos/VendorDTO";

export interface VendorUseCase {
    getSingleVendor(vendorId: string): Promise<VendorDTO | null>;
    verificationRequest(vendorId: string): Promise<VendorDTO>;
    update(vendorId: string, data: any, files: { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[] | undefined): Promise<VendorDTO>;
    updatePwd(currentPassword: string, newPassword: string, vendorId: string): Promise<boolean>;
    getBookedDates(vendorId: string): Promise<string[]>;
    addDateAvailability(vendorId: string, status: string, date: string): Promise<string[]>;
    getVendors(page: number, limit: number, search: string, category: string, location: string, sortValue: number): Promise<VendorDTO[]>;
    toggleVendorBlock(vendorId: string): Promise<VendorDTO | null>;
    changeVerifyStatus(vendorId: string, status: string, note?: string): Promise<VendorDTO>;
    getAllLocations(): Promise<string[]>;
    FavoriteVendors(userid: string, page: number, pageSize: number): Promise<{ favVendors: VendorDTO[], count: number }>;
    revenue(vendorId: string, dateType: string): Promise<number[] | null>;
}