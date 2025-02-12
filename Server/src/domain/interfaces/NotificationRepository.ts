import { Notification } from "../entities/Notification";

export interface NotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findByCondition(condition: Record<string, unknown>): Promise<Notification[]>;
  getById(id: string): Promise<Notification | null>;
  delete(id:string):Promise<Notification|null>;
  changeReadStatus(id: string, status: boolean): Promise<Notification | null>;
  findAllNotifications(recipient: string,page: number, pageSize: number): Promise<{ notifications: Notification[], count: number }>;
  findUnreadNotifications(recipient: string): Promise<Notification[]>;
}