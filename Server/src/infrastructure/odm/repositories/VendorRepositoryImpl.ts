import { VendorQuery, VendorRepository } from "../../../domain/interfaces/infrastructure interfaces/VendorRepository";
import { BaseRepository } from "./BaseRepository";
import { VendorModel, IVendor } from "../mongooseModels/Vendor";
import { mapToDomain, mapToDatabase } from "../mappers/vendorMapper";
import { Vendor } from "../../../domain/entities/Vendor";
import { injectable } from "inversify";
import { FilterQuery } from "mongoose";

@injectable()
export class VendorRepositoryImpl extends BaseRepository<IVendor, Vendor> implements VendorRepository {
  constructor(){
    super(VendorModel)
  }

  // Implement mapping methods
  protected toDomain(document: IVendor): Vendor {
    return mapToDomain(document);
  }

  protected toDatabase(domain: Vendor, password?: string): Partial<IVendor> {
    return mapToDatabase(domain, password);
  }

  async getPwdById(id: string){
    const vendor = await VendorModel.findById(id);
    return vendor ? vendor.password : null;
  }

  async updateVendorPassword(password:string , mail:string){
    try {
      const result = await VendorModel.updateOne({ email: mail }, { password: password });
      if (result.modifiedCount === 1) {
        return { success: true, message: "Vendor Password updated successfully." };
      } else {
        return { success: false, message: "Vendor not found or password not updated." };
      }
    } catch (error) {
      throw error;
    }
  }


  async requestForVerification(vendorId:string){
  
      const data=await VendorModel.findByIdAndUpdate(vendorId,{$set:{verificationRequest:true}}, { new: true });
      return data ? mapToDomain(data) : null;
    
  }

  async updateVerificationStatus(vendorId:string,status:string){

      const data=await VendorModel.findByIdAndUpdate(vendorId,{$set:{verificationRequest:false,isVerified: status === "Accepted"}}, { new: true});
      return data ? mapToDomain(data) : null;
   
  }


  async changeDateAvailability(vendorId:string,status:string,date:string){
    try {
      const vendor=await VendorModel.findOne({_id:vendorId});
      let bookedDates=vendor?.bookedDates;
      if(status==="Available"){
        if(bookedDates?.includes(date)){
          bookedDates = bookedDates.filter((bookedDate) => bookedDate !== date);
        }
      } else if (status === "Unavailable"){
        if (!bookedDates?.includes(date)) {
          bookedDates?.push(date);
        }
      }
      await vendor?.updateOne({ bookedDates });
      return bookedDates
    } catch (error) {
      throw error
    }
  }

  async getFavVendors(favs:string[], page: number, pageSize: number) {
    try {
      
      const skip = (page - 1) * pageSize;
      const favoriteVendors = await VendorModel
        .find({ _id: { $in: favs } })
        .skip(skip)
        .limit(pageSize)
        .exec();
      const count = await VendorModel.countDocuments({
        _id: { $in: favs },
      });
      const favVendors = favoriteVendors.map((vendor) => this.toDomain(vendor));
      return { favVendors, count };
    } catch (error) {
      throw error;
    }
  }

  async findAllVendors(
    page: number,
    limit: number,
    search: string,
    category:string,
    location:string,
    sortValue:number
  ): Promise<Vendor[]> {
      
      const query: FilterQuery<VendorQuery> = { isActive: true };
  
      if (search && search.trim()) {
        query.name = { $regex: new RegExp(search, 'i') };
      }
  
      if (category && category.trim()) {
        const categories = category.split(',').map(c => c.trim());
        query.vendor_type = { $in: categories };
      }
  
      if (location && location.trim()) {
        const locations = location.split(',').map(l => l.trim());
        query.city = { $in: locations };
      }
  
      const validSortValue = sortValue === 1 || sortValue === 1 ? sortValue : -1;
  
      const vendors = await VendorModel.find(query).sort({totalRating:validSortValue})
        .skip((page - 1) * limit)
        .limit(limit);
      //console.log(vendors);
  
      const result = vendors.map((vendor) => this.toDomain(vendor));
      console.log(result);
      return result;
  }

  async getVendorSuggestions(term: string): Promise<{ id: string, name: string, city: string, logoUrl: string }[]> {
    const vendors = await VendorModel.find(
      { 
        $or: [
          { name: { $regex: term, $options: "i" } },
          { city: { $regex: term, $options: "i" } }
        ],
        isActive: true
      }
    )
    .limit(5)
    .select('name city logoUrl');

    const suggestions = vendors.map(vendor => ({
        id: vendor._id.toString(),
        name: vendor.name,
        city: vendor.city,
        logoUrl: vendor.logoUrl
      }));

    return suggestions;
  }

  async findAllLocations() {
    return await VendorModel.distinct('city');
  }

  async lockDate(id: string, date: string) {
    const vendorData = await VendorModel.findById(id);
    const existingLock = vendorData?.locks.find((lock) => lock.date === date);
    if (existingLock && existingLock.isLocked) {
        return false;
    }
          
    vendorData?.locks.push({
                  date: date,
                  isLocked: true,
                });
    await vendorData?.save();
    
    return true;
  }

  async unlockDate(id: string, date: string) {
    const vendorData = await VendorModel.findById(id);
    const lockIndex = vendorData?.locks.findIndex(
                  (lock) => lock.date === date
                  ) as number;
          
    if (lockIndex !== -1) {
      vendorData?.locks.splice(lockIndex, 1);
      await vendorData?.save();
    }

    return true;
  }

  async bookDate(id: string, date: string) {
    const updatedDocument = await VendorModel.findByIdAndUpdate(id,
      { $push: { bookedDates: date } },
      { new: true}
    );
    return updatedDocument? this.toDomain(updatedDocument) : null;
  }

  async cancelDate(id: string, date: string): Promise<Vendor | null> {
    const updatedDocument = await VendorModel.findByIdAndUpdate(id,
      { $pull: { bookedDates: date } },
      { new: true}
    );

    return updatedDocument? this.toDomain(updatedDocument) : null;
  }

  async updateBookingCount(id: string): Promise<boolean> {
    const document = await VendorModel.findByIdAndUpdate(id, {$inc: { totalBooking: 1 }}, { new: true });

    return true;
  }

  async updateRating(id: string, rating: number): Promise<boolean> {
    let vendorData = await VendorModel.findById(id);
    if (vendorData) {
      vendorData.totalRating = rating;
      await vendorData.save();

      return true;
    }

    return false;
  }
}