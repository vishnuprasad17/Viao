import mongoose, { Schema, Document, Types } from "mongoose";

export type WalletActor = "user" | "admin";
export type WalletDirection = "credit" | "debit";
export type WalletTxType =
  // ── Booking payment ──────────────────────────────────────────────────
  | "wallet_used_for_booking"       // user's wallet debited at booking time
  | "stripe_payment_received"       // admin receives stripe portion
  | "wallet_payment_received"       // admin receives wallet portion (mirrors user's debit)
  // ── Cancellation ─────────────────────────────────────────────────────
  | "refund_to_user"                // admin pays refund out
  | "refund_from_cancellation"      // user receives refund into wallet
  | "cancellation_admin_fee"        // admin keeps their share on cancellation
  | "vendor_compensation_held"     // admin holds vendor compensation (manual payout later)
  | "vendor_compensation_paid";     // admin pays vendor compensation

interface IWalletTransaction extends Document {
  _id: Types.ObjectId;

  /** Who this ledger row belongs to */
  actor: WalletActor;
  /** The actor's Mongoose ID (userId or adminId) */
  actorId: Types.ObjectId;

  /** credit = balance goes up, debit = balance goes down */
  direction: WalletDirection;

  /** Business reason */
  type: WalletTxType;

  /** Absolute (positive) amount in ₹ */
  amount: number;

  /** Running wallet balance AFTER this transaction (snapshot) */
  balanceAfter: number;

  // ── Reference fields (all optional but at least bookingId always present) ──
  bookingId: Types.ObjectId;
  paymentId?: Types.ObjectId;   // set once Payment doc is created

  /** Human-readable description shown in the UI */
  description: string;

  /** Metadata: event name, vendor name, mode of payment, etc. */
  meta: {
    eventName?: string;
    vendorName?: string;
    userName?: string;
    modeOfPayment?: string;
    cancellationScenario?: "full_refund" | "partial_refund" | "no_refund";
  };

  createdAt: Date;
  updatedAt: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    actor:     { type: String, enum: ["user", "admin"], required: true, index: true },
    actorId:   { type: Schema.Types.ObjectId, required: true, index: true },
    direction: { type: String, enum: ["credit", "debit"], required: true },
    type:      {
      type: String,
      enum: [
        "wallet_used_for_booking",
        "stripe_payment_received",
        "wallet_payment_received",
        "refund_to_user",
        "refund_from_cancellation",
        "cancellation_admin_fee",
        "vendor_compensation_held",
        "vendor_compensation_paid",
      ],
      required: true,
    },
    amount:       { type: Number, required: true, min: 0 },
    balanceAfter: { type: Number, required: true },
    bookingId:    { type: Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    paymentId:    { type: Schema.Types.ObjectId, ref: "Payment", default: null },
    description:  { type: String, required: true, maxlength: 500 },
    meta: {
      eventName:             { type: String, default: null },
      vendorName:            { type: String, default: null },
      userName:              { type: String, default: null },
      modeOfPayment:         { type: String, default: null },
      cancellationScenario:  { type: String, default: null },
    },
  },
  { timestamps: true }
);

// Fast queries: "all transactions for this user" / "all for admin"
WalletTransactionSchema.index({ actor: 1, actorId: 1, createdAt: -1 });
WalletTransactionSchema.index({ bookingId: 1, actor: 1 });

const WalletTransactionModel = mongoose.model<IWalletTransaction>("WalletTransaction", WalletTransactionSchema);
export { WalletTransactionModel, IWalletTransaction };