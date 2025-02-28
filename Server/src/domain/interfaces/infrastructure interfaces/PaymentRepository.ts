import { Payment } from "../../entities/Payment";

export interface PaymentRepository {
    create(payment: Payment): Promise<Payment>;
    findOne(condition: Record<string, unknown>): Promise<Payment | null>;
    findAllPayments(page: number, pageSize: number): Promise<{ payment: Payment[], count: number }>;
    getAdminRevenueDetails(start: Date, end: Date,
        groupBy:
          | {
              day: {
                $isoDayOfWeek: string;
              };
            }
          | {
              month: {
                $month: string;
              };
            }
          | {
              year: {
                $year: string;
              };
            },
        sortField: string
      ): Promise<Array<{ _id: { [key: string]: number }; totalRevenue: number }>>;
      getVendorRevenueDetails(vendorId: string, start: Date, end: Date,
        groupBy: 
          | {
              day: {
                $isoDayOfWeek: string;
              };
            }
          | {
              month: {
                $month: string;
              };
            }
          | {
              year: {
                $year: string;
              };
            },
        sortField: string
      ): Promise<{ _id: { day?: number; month?: number; year?: number }; totalRevenue: number }[]>;
}