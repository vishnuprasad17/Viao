import { Notification } from "../entities/Notification";


export interface NotificationService {
    createNotification(id: string, message: string, type: string): Promise<Notification>;
}