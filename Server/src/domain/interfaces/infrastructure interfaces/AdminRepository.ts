import { Admin } from "../../entities/Admin";

export interface AdminRepository {
  findOne(condition: Record<string, unknown>): Promise<Admin | null>;
  getById(id: string): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;

  getPwdById(id: string): Promise<string | null>;
  updateWallet(amount: number): Promise<boolean>;
  refundFromWallet(amount: number): Promise<boolean>;

  storeRefreshToken(adminId: string, sessionId: string, token: string, tokenFamily: string): Promise<void>;
  getRefreshToken(adminId: string, sessionId: string): Promise<string | null>;
  updateRefreshToken(adminId: string, sessionId: string, newToken: string): Promise<void>;
  deleteRefreshToken(adminId: string, sessionId: string): Promise<number>;
  invalidateAllRefreshTokens(adminId: string): Promise<void>;
  invalidateTokenFamily(adminId: string, tokenFamily: string): Promise<void>;
  cleanupExpiredTokens(adminId: string): Promise<void>;
  getActiveSessionCount(adminId: string): Promise<number>;
}