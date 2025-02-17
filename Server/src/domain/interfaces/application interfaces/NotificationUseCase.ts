import { Notification } from "../../entities//Notification";

export interface NotificationUseCase {
    getNotifications(recipient: string,page: number, pageSize: number): Promise<{notification: Notification[],totalPages: number}>;
    getUnreadNotifications(recipient: string): Promise<number>;
    getNotificationForAdmin(adminId: string): Promise<Notification[]>;
    changeReadStatus(id: string, recipient: string): Promise<Notification[]>;
    delete(id: string): Promise<Notification>;
}