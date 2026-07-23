import { WalletTransactionRepository } from "../../../domain/interfaces/infrastructure interfaces/WalletTransactionRepository";
import { BaseRepository } from "./BaseRepository";
import {
  WalletTransactionModel,
  IWalletTransaction,
  WalletActor,
} from "../mongooseModels/WalletTransaction";
import { mapToDomain, mapToDatabase } from "../mappers/walletTransactionMapper";
import { WalletTransaction } from "../../../domain/entities/WalletTransaction";
import { injectable } from "inversify";
import { Types } from "mongoose";

@injectable()
export class WalletTransactionRepositoryImpl
  extends BaseRepository<IWalletTransaction, WalletTransaction>
  implements WalletTransactionRepository
{
  constructor() {
    super(WalletTransactionModel);
  }

  protected toDomain(document: IWalletTransaction): WalletTransaction {
    return mapToDomain(document);
  }
  
  protected toDatabase(domain: WalletTransaction): Partial<IWalletTransaction> {
    return mapToDatabase(domain);
  }

  async findByActor(
    actor: WalletActor,
    actorId: string,
    page: number,
    pageSize: number
  ): Promise<{ transactions: WalletTransaction[]; total: number }> {
    const filter = { actor, actorId: new Types.ObjectId(actorId) };
    const [transactions, total] = await Promise.all([
      WalletTransactionModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      WalletTransactionModel.countDocuments(filter),
    ]);

    return {
      transactions: transactions.map((d) => mapToDomain(d)),
      total,
    };
  }

  async findByBookingId(
    bookingId: string
  ): Promise<WalletTransaction[]> {
    const docs = await WalletTransactionModel.find({
      bookingId: new Types.ObjectId(bookingId),
    })
      .sort({ createdAt: 1 })
      .lean<IWalletTransaction[]>();

    return docs.map((d) => mapToDomain(d));
  }

  async findByBookingIds(
    bookingIds: string[],
    types?: string[]
  ): Promise<WalletTransaction[]> {
    const query: any = { bookingId: { $in: bookingIds } };
    if (types && types.length > 0) {
      query.type = { $in: types };
    }
    const documents = await WalletTransactionModel.find(query).exec();
    return documents.map((d) => this.toDomain(d)); // adjust to your actual mapper name
  }
}