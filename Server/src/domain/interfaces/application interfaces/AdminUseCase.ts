import { AdminDTO } from "../../dtos/AdminDTO";

export interface AdminUseCase {
    getData(adminId: string): Promise<AdminDTO>;
    analytics(dateType: string): Promise<AnalyticsResponse | null>;
}

export interface AnalyticsResponse {
    totalUsers: number,
    totalVendors: number,
    totalBookings: number,
    revenueArray: number[]
}