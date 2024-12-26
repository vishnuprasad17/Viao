import bcrypt from "bcrypt";
import sgMail from '@sendgrid/mail';
import { BaseError } from '../shared/error/base.error';
import userRepository from '../data-access/user.repository';

class UserService {
  async sendEmail(name: string, email: string, mobile: string, subject: string, message: string) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

        const msg = {
            to: process.env.RECEIVER_EMAIL!,
            from: process.env.SENDER_EMAIL!,
            replyTo: {
              email: email,
              name: name,
            },
            subject: subject,
            text: `${message}\n\nName: ${name}\nMobile: ${mobile}`,
        };

        await sgMail.send(msg);

        const autoReplyMsg = {
            to: email,
            from: process.env.SENDER_EMAIL!,
            subject: "Thank you for contacting us!",
            text: `Hello ${name},\n\nThank you for reaching out. We have received your message and will get back to you soon.\n\nBest regards, Team Viao`, // Auto-reply message
        };

        await sgMail.send(autoReplyMsg);

        console.log("Email sent to both receiver and user.");
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new BaseError("Error sending email! Try again later.", 500);
    }
}

async updateProfile(
  name: string,
  phone: number,
  userId: string,
  imageUrl: string
) {
  try {
    const existingUser = await userRepository.getById(userId);
    if (!existingUser) {
      throw new BaseError("User not found", 404);
    }

    if (!existingUser.isActive) {
      throw new BaseError("Can't perfom action right now. Please refresh.", 401);
    }

    const update = {
      name: name || existingUser.name,
      phone: phone || existingUser.phone,
      imageUrl: imageUrl || existingUser.imageUrl,
    };
    const result = await userRepository.update(userId, update);
    const userData = await userRepository.getById(userId);
    return userData;
  } catch (error) {
    console.error("Error in updateProfileService:", error)
    throw new BaseError("Failed to update profile.", 500);
  }
}

async checkCurrentPassword(currentPassword: string, userId: string) {
  try {
    const existingUser = await userRepository.getById(userId);

    if (!existingUser) {
      throw new BaseError("User not found", 404);
    }

    if(!existingUser.isActive) {
      throw new BaseError("Something went wrong. Please refresh.", 401);
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      existingUser.password
    );
    if (!passwordMatch) {
      throw new BaseError("Paswword doesn't match", 401);
    }

    return passwordMatch;
  } catch (error) {
    console.error("Error in checkCurrentPasswordService:", error)
    throw error;
  }
}

async UpdatePassword(newPassword: string, userId: string) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const existingUser = await userRepository.getById(userId);
    if (!existingUser) {
      throw new BaseError("user not found", 404);
    }
    const email = existingUser.email;

    const updatedValue = await userRepository.UpdatePassword(
      hashedPassword,
      email
    );
    if (updatedValue) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error in UpdatePasswordService:", error)
  throw new BaseError("Failed to update password.", 500);
  }
}

async FavoriteVendors(userid: string, page: number, pageSize: number) {
  try {
    const userData = await userRepository.getById(userid);
    if (!userData) {
      throw new BaseError("User not found", 404);
    }
    const favs = userData.favourite;

    if (!favs || favs.length === 0) {
      throw new BaseError("No favorite vendors found for this user", 404);
    }
    const { favoriteVendors: result, count: totalFavsCount } =
      await userRepository.getfavVendors(favs, page, pageSize);
    return { result, totalFavsCount };
  } catch (error) {
    console.error("Error in FavoriteVendor:", error)
    throw error;
  }
}

async deleteFromFavorite(userId: string, vendorId: string) {
  try {
    const data = await userRepository.deletefavVendor(userId, vendorId);
    return data;
  } catch (error) {
    console.error("Error in FavoriteVendors:", error)
    throw error;
  }
}

async getUsers(page: number, limit: number, search: string) {
  try {
    const users = await userRepository.findAllUsers(page, limit, search);
    return users;
  } catch (error) {
    console.error("Error in getUsers:", error)
    throw new BaseError("Failed to get users.", 500);
  }
}

async getUsersCount() {
  try {
    const total = await userRepository.countDocuments();
    return total;
  } catch (error) {
    console.error("Error in getUsersCount:", error)
    throw new BaseError("Failed to get users count.", 500); 
  }
}

async toggleUserBlock(userId: string): Promise<void> {
  try {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new BaseError("User not found.", 404)
    }

    user.isActive = !user.isActive; // Toggle the isActive field
    await user.save();
  } catch (error) {
    console.error("Error in toggleUserBlock:", error)
    throw new BaseError("Failed to toggle user block.", 500);
  }
}

async FavoriteVendor(vendorId: string, userId: string) {
  try {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    if (user.favourite.includes(vendorId)) {
      const index = user.favourite.indexOf(vendorId);
      user.favourite.splice(index, 1);
      await user.save();
      return false;
    }
    user.favourite.push(vendorId);
    await user.save();

    return true;
  } catch (error) {
    console.error("Error in addToFavorites service:", error);
    throw new Error("Failed to add vendor to favorites.");
  }
}

async findUser(userId: string) {
  try {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new BaseError("User not found.", 404);
    }
    return user;
  } catch (error) {
    console.error("Error in findUser:", error);
    throw new BaseError("Failed to find user.", 500);
  }
}

}

export default new UserService();