import { UserRepository } from "../../../domain/interfaces/infrastructure interfaces/UserRepository";
import { BaseRepository } from "./BaseRepository";
import { UserModel, IUser} from "../mongooseModels/User";
import { mapToDatabase, mapToDomain } from "../mappers/userMapper";
import { User } from "../../../domain/entities/User";
import { injectable } from "inversify";

@injectable()
export class UserRepositoryImpl extends BaseRepository<IUser, User> implements UserRepository {
  constructor() {
    super(UserModel);
  }

  // Implement mapping methods
  protected toDomain(document: IUser): User {
    return mapToDomain(document);
  }

  protected toDatabase(domain: User, password?: string): Partial<IUser> {
    return mapToDatabase(domain, password);
  }

  async getPwdById(id: string){
    const user = await UserModel.findById(id);
    return user ? user.password : null;
  }

  async updatePassword(password: string, mail: string) {
      try {
        const result = await UserModel.updateOne(
          { email: mail },
          { password: password }
        );
        if (result.modifiedCount === 1) {
          return { success: true, message: "Password updated successfully." };
        } else {
          return {
            success: false,
            message: "User not found or password not updated.",
          };
        }
      } catch (error) {
        throw error;
      }
    }
  
    async deleteFavVendor(userId: string, vendorId: string) {
      const data = await UserModel.findByIdAndUpdate(
          userId,
          { $pull: { favourite: vendorId } },
          { new: true }
        );

        return data ? this.toDomain(data) : null;
        
    }
  
    async findAllUsers(
      page: number,
      limit: number,
      search: string
    ) {
      try {
        const query = search ? { name: { $regex: new RegExp(search, "i") } } : {};
        const users = await UserModel.find(query)
          .skip((page - 1) * limit)
          .limit(limit);
  
        return users.map((user) => this.toDomain(user));
      } catch (error) {
        throw error;
      }
    }

    async addFavVendor(userId: string, vendorId: string) {
      try {
        const user = await UserModel.findByIdAndUpdate(
          userId,
          { $push: { favourite: vendorId } },
          { new: true }
        );
        return user ? this.toDomain(user) : null;
      } catch (error) {
        throw error;
      }
    }

    async refundToWallet(id: string, amount: number): Promise<boolean> {
      let UserData=await UserModel.findById(id);
      if (UserData) {
        UserData.wallet += amount;
        await UserData.save();
      }
      
      return UserData ? true : false;
    }

    async deductFromWallet(id: string, amount: number): Promise<boolean> {
      let UserData=await UserModel.findById(id);
      if (UserData) {
        UserData.wallet -= amount;
        await UserData.save();
      }
      return UserData? true : false;
    }
}