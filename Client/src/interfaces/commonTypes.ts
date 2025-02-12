
export interface Notification {
  id: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  date: string;
  name: string;
  eventName: string;
  city: string;
  pin: number;
  mobile: number;
  vendorId: string;
  vendorName?: string;
  userId: string;
  status: string;
  payment_status: string;
  amount: number;
  refundAmount:number;
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