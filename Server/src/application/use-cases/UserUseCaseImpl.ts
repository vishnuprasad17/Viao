import bcrypt from 'bcrypt';
import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { UserRepository } from "../../domain/interfaces/UserRepository";
import { EmailService } from "../../domain/interfaces/EmailService";
import { BaseError } from "../../domain/errors/BaseError";
import { UploadService } from '../../domain/interfaces/UploadService';
import { PasswordService } from '../../domain/interfaces/PasswordService';
import { UserDTO } from '../../domain/dtos/UserDTO';
import { UserUseCase } from '../../domain/interfaces/UserUseCase';

@injectable()
export class UserUseCaseImpl implements UserUseCase {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository,
              @inject(TYPES.EmailService) private emailService: EmailService,
              @inject(TYPES.UploadService) private uploadService: UploadService,
              @inject(TYPES.PasswordService) private passwordService: PasswordService) {}

  async contact(data: {name: string, email: string, mobile: string, subject: string, message: string}): Promise<boolean> {
    return await this.emailService.sendEmail(data);
  }

  async update(name: string, phone: number, userId: string, file: Express.Multer.File | undefined): Promise<UserDTO> {
      // Fetch the existing user
      const existingUser = await this.userRepository.getById(userId);
      if (!existingUser) {
        throw new BaseError("User not found", 404);
      }
  
      // Check if the user is active
      if (!existingUser.isActive) {
        throw new BaseError("Can't perform action right now. Please refresh.", 401);
      }
  
      // Determine the image URL
      let imgUrl = "";
      if (file) {
        imgUrl = await this.uploadService.upload(file, "user") as string; // Upload the file
      } else if (existingUser.imageUrl) {
        imgUrl = existingUser.imageUrl; // Retain existing image URL if available
      }
  
      // Prepare the update object
      const update = {
        name: name || existingUser.name,
        phone: phone || existingUser.phone,
        imageUrl: imgUrl || existingUser.imageUrl,
      };

      existingUser.updateFields(update);
  
      // Update the user in the repository
      const result = await this.userRepository.update(userId, existingUser);
      if (!result) {
        throw new BaseError("Failed to update user profile.", 500);
      }
      const userDto = UserDTO.fromDomain(result);

      return userDto;
  }

  async updatePwd(currentPassword: string, newPassword: string, userId: string): Promise<boolean> {
          const existingUser = await this.userRepository.getById(userId);
          const password = await this.userRepository.getPwdById(userId);
              if (!existingUser || !password) {
                throw new BaseError("User not found", 404);
              }
          
              if(!existingUser.isActive) {
                throw new BaseError("Something went wrong. Please refresh.", 401);
              }
              const passwordMatch = await bcrypt.compare(
                currentPassword,
                password
              );
              if (!passwordMatch) {
                throw new BaseError("Paswword doesn't match", 401);
              }
              const hashedPassword = await this.passwordService.hashPassword(newPassword);
              const updatedValue = await this.userRepository.updatePassword(
                hashedPassword,
                existingUser.email
              )
              return updatedValue ? true : false;
  }

  async deleteFromFavorite(userId: string, vendorId: string): Promise<UserDTO> {
    const updatedUser = await this.userRepository.deleteFavVendor(userId, vendorId);
    if (!updatedUser) {
      throw new BaseError("User not found.", 404);
    }
    const userDto = UserDTO.fromDomain(updatedUser);

    return userDto;
  }

  async getUsers(page: number, limit: number, search: string): Promise<{ users: UserDTO[], totalUsers: number}> {
      const users = await this.userRepository.findAllUsers(page, limit, search);
      const totalUsers = await this.userRepository.countDocuments();
      if (!users) {
        throw new BaseError("Failed to fetch users.", 500)
      }
      const userDtos = UserDTO.fromDomainList(users);

      return {users: userDtos, totalUsers};
  }

  async toggleUserBlock(userId: string): Promise<UserDTO> {
      const user = await this.userRepository.getById(userId);
      if (!user) {
        throw new BaseError("User not found.", 404)
      }
  
      const updatedUser = await this.userRepository.block(userId, !user.isActive);
      if (!updatedUser) {
        throw new BaseError("Failed to update user status.", 500);
      }
      const userDto = UserDTO.fromDomain(updatedUser);

      return userDto;
  }

  async favoriteVendor(vendorId: string, userId: string): Promise<{ status: boolean, data: UserDTO}> {
      const user = await this.userRepository.getById(userId);
      if (!user) {
        throw new BaseError("User not found.", 404);
      }
  
      if (user.favourite.includes(vendorId)) {
        const updatedUser = await this.userRepository.deleteFavVendor(userId, vendorId);
        if (!updatedUser) {
          throw new BaseError("Failed to update user data.", 500);
        }
        const userDtos = UserDTO.fromDomain(updatedUser);
        
        return { status: false, data: userDtos };
      }
      const updatedUser = await this.userRepository.addFavVendor(userId, vendorId);
      if (!updatedUser) {
        throw new BaseError("Failed to update user data.", 500);
      }
      const userDtos = UserDTO.fromDomain(updatedUser);
  
      return { status: true, data: userDtos };
  }

  async findUser(userId: string): Promise<UserDTO> {
      const user = await this.userRepository.getById(userId);
      if (!user) {
        throw new BaseError("User not found.", 404);
      }
      const userDto = UserDTO.fromDomain(user);

      return userDto;
  }
}