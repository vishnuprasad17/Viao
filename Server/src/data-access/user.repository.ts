import User from "../models/user.model";
import { IUserDocument } from "../interfaces/user.interface";
import vendor from "../models/vendor.model";
import { BaseRepository } from "../shared/data-access/base.repo";

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

  async getfavVendors(favs:string[], page: number, pageSize: number) {
    try {
      
      const skip = (page - 1) * pageSize;
      const favoriteVendors = await vendor
        .find({ _id: { $in: favs } })
        .skip(skip)
        .limit(pageSize)
        .exec();
      const count = await vendor.countDocuments({
        _id: { $in: favs },
      });
      return { favoriteVendors, count };
    } catch (error) {
      throw error;
    }
  }

  async deletefavVendor(userId: string, vendorId: string) {
    return await User.findByIdAndUpdate(
        userId,
        { $pull: { favourite: vendorId } },
        { new: true }
      );

      
  }
}

export default new UserRepository();