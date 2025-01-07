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

export interface Chats {
  _id:string;
  members: string[];
  recentMessage: string;
  updatedAt:Date;
  createdAt:Date;
}

export interface Messages {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  imageName: string;
  imageUrl: string;
  isRead: boolean;
  isDeleted: boolean;
  deletedIds: string[];
  emoji: string;
  createdAt:number;
}