import User from "../models/user.model";
import { IUserDocument } from "../interfaces/model.interface";
import { BaseRepository } from "../../../shared/data-access/base.repo";

class UserRepository extends BaseRepository<IUserDocument> {
  constructor() {
    super(User);
  }

  async UpdatePassword(password: string, mail: string) {
    try {
      const result = await User.updateOne(
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
}

export default new UserRepository();