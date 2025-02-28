
export class Service {
    constructor(
        public readonly id: string,
        public vendorId: string,
        public name: string,
        public price: number
    ) {}

    // Method to update specific fields
      updateFields(fields: Partial<Pick<Service, "name" | "price">>) {
        if (fields.name !== undefined) {
          this.name = fields.name;
        }
        if (fields.price !== undefined) {
          this.price = fields.price;
        }
      }
}