import { VendorData } from "./vendorTypes";

export interface Notification {
  _id: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  date: string;
  name: string;
  eventName: string;
  city: string;
  pin: number;
  mobile: number;
  createdAt: Date;
  vendorId: VendorData;
  userId: string;
  status: string;
  payment_status: string;
  amount: number;
  refundAmount:number;
}

export interface VendorType {
  _id: string;
  type: string;
  status: boolean;
  image:string;
  imageUrl:string;
}