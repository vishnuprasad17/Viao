import { Types } from "mongoose";
import { WalletTransaction } from "../../../domain/entities/WalletTransaction";
import { IWalletTransaction } from "../mongooseModels/WalletTransaction";

// Mapping from database model (MongoDB) to domain model
  export const mapToDomain = (document: IWalletTransaction): WalletTransaction => {
    return new WalletTransaction(
        document._id.toString(),
        document.actor,
        document.actorId.toString(),
        document.direction,
        document.type,
        document.amount,
        document.balanceAfter,
        document.bookingId.toString(),
        document.paymentId ? document.paymentId.toString() : null,
        document.description,
        document.meta ?? {},
        document.createdAt
    );
}

// Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: WalletTransaction): Partial<IWalletTransaction> => {
    return {
      actor: domain.actor,
      actorId: new Types.ObjectId(domain.actorId),
      direction: domain.direction,
      type: domain.type,
      amount: domain.amount,
      balanceAfter: domain.balanceAfter,
      bookingId: new Types.ObjectId(domain.bookingId),
      paymentId: domain.paymentId ? new Types.ObjectId(domain.paymentId) : undefined,
      description: domain.description,
      meta: domain.meta ?? {},
    };
  };