import { AdminDTO } from "../../dtos/AdminDTO";
import { WalletTransactionDTO } from "../../dtos/WalletTransactionDto";

export interface AdminUseCase {
    getData(adminId: string): Promise<AdminDTO>;
    getTransactions(adminId: string, page: number, pageSize: number): Promise<{wallet: number, transactions: WalletTransactionDTO[], totalPages: number}>;
    analytics(dateType: string): Promise<AnalyticsResponse | null>;
}

export interface AnalyticsResponse {
    totalUsers: number,
    totalVendors: number,
    totalBookings: number,
    revenueArray: number[]
}