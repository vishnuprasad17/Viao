import { WalletTransaction } from "../entities/WalletTransaction";
import { WalletActor, WalletTxType } from "../../infrastructure/odm/mongooseModels/WalletTransaction";

export class WalletTransactionDTO {
  constructor(
  public id: string,
  public direction: "credit" | "debit",
  public type: WalletTxType,
  public amount: number,
  public balanceAfter: number,
  public description: string,
  public eventName: string | undefined,
  public vendorName: string | undefined,
  public userName: string | undefined,
  public modeOfPayment: string | undefined,
  public cancellationScenario: "full_refund" | "partial_refund" | "no_refund" | undefined,
  public createdAt: Date,
  ) {}

  static fromDomain(tx: WalletTransaction): WalletTransactionDTO {
    return new WalletTransactionDTO(
      tx.id,
      tx.direction,
      tx.type,
      tx.amount,
      tx.balanceAfter,
      tx.description,
      tx.meta.eventName,
      tx.meta.vendorName,
      tx.meta.userName,
      tx.meta.modeOfPayment,
      tx.meta.cancellationScenario,
      tx.createdAt,
    );
  }

  static fromDomainList(txs: WalletTransaction[]): WalletTransactionDTO[] {
    return txs.map(WalletTransactionDTO.fromDomain);
  }
}