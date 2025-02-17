export class User {
    constructor(
        public readonly id: string,
        public name: string,
        public email: string,
        public phone: number,
        public isActive: boolean = true,
        public imageUrl: string,
        public favourite: string[],
        public wallet: number,
    ) {}

    // Method to update specific fields
  updateFields(fields: Partial<Pick<User, "name" | "phone" | "imageUrl">>) {
    if (fields.name !== undefined) {
      this.name = fields.name;
    }
    if (fields.phone !== undefined) {
      this.phone = fields.phone;
    }
    if (fields.imageUrl !== undefined) {
      this.imageUrl = fields.imageUrl;
    }
  }
  }