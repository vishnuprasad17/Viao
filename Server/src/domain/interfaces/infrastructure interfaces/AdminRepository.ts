import { Admin } from "../../entities/Admin";

export interface AdminRepository {
  findOne(condition: Record<string, unknown>): Promise<Admin | null>;
  getById(id: string): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;

  getPwdById(id: string): Promise<string | null>;
  updateWallet(amount: number): Promise<boolean>;
  refundFromWallet(amount: number): Promise<boolean>;
}