import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import vendorRepository from "../data-access/auth.repo";
import vendorTypeRepository from "../data-access/type.repo";
import { BaseError } from "../../../shared/error/base.error";

function toTitleCase(city: string): string {
  return city.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

class VendorSignupService {
  async signup(
  email: string,
  password: string,
  name: string,
  phone: number,
  city: string,
  vendor_type: string
) {
  try {
    const existingVendor = await vendorRepository.findByEmail(email);
    if (existingVendor) {
      throw new BaseError("vendor already exists", 409);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const isActive: boolean = true;
    const isVerified: boolean = false;
    const verificationRequest: boolean = false;
    const totalBooking: number = 0;

    const vendorType = await vendorTypeRepository.findByType(vendor_type);
    const newVendor = await vendorRepository.create({
      email,
      password: hashedPassword,
      name,
      phone,
      city:toTitleCase(city),
      isActive,
      isVerified,
      verificationRequest,
      totalBooking,
      vendor_type: vendorType?._id
    });

    const token = jwt.sign({ _id: newVendor._id }, process.env.JWT_SECRET!);

    return {vendor:newVendor, token};
  } catch (error) {
    console.log("Error occurred while signing:", error);
    throw new BaseError("Failed to create new vendor.", 500);
  }
};
}

export default new VendorSignupService();