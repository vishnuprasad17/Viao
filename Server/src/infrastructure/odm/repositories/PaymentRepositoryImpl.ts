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

  async findByBookingId(bookingId: string): Promise<Payment | null> {
    const document = await PaymentModel.findOne({
      bookingId: new Types.ObjectId(bookingId),
    });

    return document ? mapToDomain(document) : null;
  }
}
