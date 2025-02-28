import { User } from "../../entities/User";

export interface UserRepository {
  getById(id: string): Promise<User | null>;
  create(user: User, password: string): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  countDocuments(condition?:Record<string,unknown>): Promise<number>;
  block(id: string, status: boolean): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone:number): Promise<User | null>;
  // delete(id: string): Promise<User | null>;
  getPwdById(id: string): Promise<string | null>;
  updatePassword(password: string, mail: string): Promise<{ success: boolean, message: string }>;
  deleteFavVendor(userId: string, vendorId: string): Promise<User | null>;
  findAllUsers(page: number, limit: number, search: string): Promise<User[]>;
  addFavVendor(userId: string, vendorId: string): Promise<User | null>;
  refundToWallet(id: string, amount: number): Promise<boolean>;
  deductFromWallet(id: string, amount: number): Promise<boolean>;
}