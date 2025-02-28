import { PaymentRepository } from "../../../domain/interfaces/infrastructure interfaces/PaymentRepository";
import { BaseRepository } from "./BaseRepository";
import { PaymentModel, IPayment } from "../mongooseModels/Payment";
import { mapToDatabase, mapToDomain, mapToDomainPopulate } from "../mappers/paymentMapper";
import { Payment } from "../../../domain/entities/Payment";
import { injectable } from "inversify";
import { Types } from "mongoose";

@injectable()
export class PaymentRepositoryImpl
  extends BaseRepository<IPayment, Payment>
  implements PaymentRepository
{
  constructor() {
    super(PaymentModel);
  }

  // Implement mapping methods
  protected toDomain(document: IPayment): Payment {
    return mapToDomain(document);
  }

  protected toDatabase(domain: Payment): Partial<IPayment> {
    return mapToDatabase(domain);
  }

  async findAllPayments(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const documents = await PaymentModel.find()
      .populate("userId")
      .populate("vendorId")
      .populate("bookingId")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageSize);
    const payment = documents.map((payment) => mapToDomainPopulate(payment));
    const count = await PaymentModel.countDocuments({});

    return { payment, count };
  }

  async getAdminRevenueDetails(start: Date, end: Date,
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
  ): Promise<Array<{ _id: { [key: string]: number }; totalRevenue: number }>> {
    const revenueData = await PaymentModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lt: end,
          },
        },
      },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: "$amount" },
        },
      },
      {
        $sort: { [`_id.${sortField}`]: 1 },
      },
    ]);

    return revenueData;
  }

  async getVendorRevenueDetails(vendorId: string, start: Date, end: Date,
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
  ): Promise<{ _id: { day?: number; month?: number; year?: number }; totalRevenue: number }[]> {
    const revenueData = await PaymentModel.aggregate([
                {
                  $match: {
                    vendorId: new Types.ObjectId(vendorId),
                    createdAt: {
                      $gte: start,
                      $lt: end,
                    },
                  },
                },
                {
                  $group: {
                    _id: groupBy,
                    totalRevenue: { $sum: "$amount" },
                  },
                },
                {
                  $sort: { [`_id.${sortField}`]: 1 },
                },
              ]);

              return revenueData;
  }
}
