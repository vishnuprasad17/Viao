export class Service {
  constructor(
    public id: string,
    public vendorId: string,
    public name: string,
    public price: number,
    public advancePercentage: number = 100,
    public minimumBookingNoticeInDays: number = 1,
    public cancellationFullRefundBeforeDays: number = 7,
    public cancellationPartialRefundBeforeDays: number | null = null,
    public partialRefundPercentage: number | null = null,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  updateFields(fields: Partial<Service>) {
    if (fields.name !== undefined) this.name = fields.name;
    if (fields.price !== undefined) this.price = fields.price;
    if (fields.advancePercentage !== undefined) this.advancePercentage = fields.advancePercentage;
    if (fields.minimumBookingNoticeInDays !== undefined) this.minimumBookingNoticeInDays = fields.minimumBookingNoticeInDays;
    if (fields.cancellationFullRefundBeforeDays !== undefined) this.cancellationFullRefundBeforeDays = fields.cancellationFullRefundBeforeDays;
    if (fields.cancellationPartialRefundBeforeDays !== undefined) this.cancellationPartialRefundBeforeDays = fields.cancellationPartialRefundBeforeDays;
    if (fields.partialRefundPercentage !== undefined) this.partialRefundPercentage = fields.partialRefundPercentage;
  }

  getAdvanceAmount(): number {
    return Math.round((this.price * this.advancePercentage) / 100);
  }
}