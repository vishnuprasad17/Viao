import { WalletActor, WalletDirection, WalletTxType } from "../../infrastructure/odm/mongooseModels/WalletTransaction";

export class WalletTransaction {
  constructor(
    public readonly id: string,
    public readonly actor: WalletActor,
    public readonly actorId: string,
    public readonly direction: WalletDirection,
    public readonly type: WalletTxType,
    public readonly amount: number,
    public readonly balanceAfter: number,
    public readonly bookingId: string,
    public readonly paymentId: string | null,
    public readonly description: string,
    public readonly meta: {
      eventName?: string;
      vendorName?: string;
      userName?: string;
      modeOfPayment?: string;
      cancellationScenario?: "full_refund" | "partial_refund" | "no_refund";
    },
    public readonly createdAt: Date
  ) {}
}