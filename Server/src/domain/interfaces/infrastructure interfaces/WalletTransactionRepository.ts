import { WalletTransaction } from "../../entities/WalletTransaction";
import { WalletActor } from "../../../infrastructure/odm/mongooseModels/WalletTransaction";

export interface WalletTransactionRepository {
  create(transaction: WalletTransaction): Promise<WalletTransaction>;
  findByActor(actor: WalletActor, actorId: string, page: number, pageSize: number): Promise<{ transactions: WalletTransaction[]; total: number }>;
  findByBookingId(bookingId: string): Promise<WalletTransaction[]>;
  findByBookingIds(bookingIds: string[], types?: string[]): Promise<WalletTransaction[]>;
}