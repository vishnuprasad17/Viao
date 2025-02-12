export class Vendor {
    constructor(
      public readonly id: string,
      public email: string,
      public name: string,
      public phone: number,
      public city: string,
      public about: string,
      public logo: string,
      public coverpic: string,
      public isVerified: boolean,
      public verificationRequest: boolean,
      public totalBooking: number,
      public vendorType: string,
      public isActive: boolean,
      public coverpicUrl: string,
      public logoUrl: string,
      public bookedDates: string[],
      public totalRating: number = 0,
    ) {}

    // Method to update specific fields name: formData.name,
    updateFields(fields: Partial<Pick<Vendor, "name" | "city" | "phone" | "coverpicUrl" | "logoUrl" | "logo" | "coverpic" | "about">>) {
        if (fields.name !== undefined) {
          this.name = fields.name;
        }
        if (fields.city !== undefined) {
          this.city = fields.city;
        }
        if (fields.phone !== undefined) {
          this.phone = fields.phone;
        }
        if (fields.coverpicUrl !== undefined) {
          this.coverpicUrl = fields.coverpicUrl;
        }
        if (fields.logoUrl!== undefined) {
          this.logoUrl = fields.logoUrl;
        }
        if (fields.logo!== undefined) {
          this.logo = fields.logo;
        }
        if (fields.coverpic!== undefined) {
          this.coverpic = fields.coverpic;
        }
        if (fields.about!== undefined) {
          this.about = fields.about;
        }
      }
  }  