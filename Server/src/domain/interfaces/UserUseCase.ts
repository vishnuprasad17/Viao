import { UserDTO } from "../dtos/UserDTO";

export interface UserUseCase {
    contact(data: {name: string, email: string, mobile: string, subject: string, message: string}): Promise<boolean>;
    update(name: string, phone: number, userId: string, file: Express.Multer.File | undefined): Promise<UserDTO>;
    updatePwd(currentPassword: string, newPassword: string, userId: string): Promise<boolean>;
    deleteFromFavorite(userId: string, vendorId: string): Promise<UserDTO>;
    getUsers(page: number, limit: number, search: string): Promise<{ users: UserDTO[], totalUsers: number}>;
    toggleUserBlock(userId: string): Promise<UserDTO>;
    favoriteVendor(vendorId: string, userId: string): Promise<{ status: boolean, data: UserDTO}>;
    findUser(userId: string): Promise<UserDTO>;
}