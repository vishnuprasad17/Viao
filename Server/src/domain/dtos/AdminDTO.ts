import { Admin } from "../entities/Admin";

export class AdminDTO {
    id:string;
    email:string;
    wallet: number;
    createdAt:Date;
  
    constructor(admin: Admin) {
      this.id = admin.id;
      this.email = admin.email;
      this.wallet = admin.wallet;
      this.createdAt = admin.createdAt;
    }
  
    static fromDomain(admin: Admin): AdminDTO {
      return new AdminDTO(admin);
    }
  }