import { UserData } from "./userTypes";
import { VendorData } from "./vendorTypes";

export interface Review {
  id: string;
  vendorId: VendorData
  userId: UserData;
  rating: number;
  content: string;
  reply: Array<string>;
  createdAt: Date;
  replyAt: Date;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}

export interface Service {
  id: string;
  vendorId: string;
  name: string;
  price: string;
}

export interface Booking {
  id: string;
  date: string;
  name: string;
  eventName: string;
  city: string;
  pin: number;
  mobile: number;
  vendorId: VendorData;
  userId: UserData;
  status: string;
  payment_status: string;
  amount: number;
  refundAmount:number;
  deductedFromWallet:number;
  createdAt: Date;
}

export interface Payment {
  id: string;
  amount: number;
  vendorId: VendorData;
  userId: UserData;
  bookingId: Booking;
  modeOfPayment: string;
  transactionRef: string;
  createdAt: Date;
}

export interface VendorType {
  id: string;
  type: string;
  status: boolean;
  imageUrl:string;
}

export interface Chats {
  id:string;
  members: string[];
  recentMessage: string;
  updatedAt:Date;
  createdAt:Date;
}

export interface Messages {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  imageName: string;
  imageUrl: string;
  isRead: boolean;
  isDeleted: boolean;
  deletedIds: string[];
  createdAt:number;
}