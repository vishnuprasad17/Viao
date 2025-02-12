import { Notification } from "../entities/Notification";

export class NotificationDTO {
    id: string;
    message: string;
    read: boolean;
    type: string;
    createdAt: Date;
  
    constructor(notification: Notification) {
      this.id = notification.id;
      this.message = notification.message;
      this.read = notification.read;
      this.type = notification.type;
      this.createdAt = notification.createdAt;
    }
  
    static fromDomain(notification: Notification): NotificationDTO {
      return new NotificationDTO(notification);
    }
  
    static fromDomainList(notifications: Notification[]): NotificationDTO[] {
      return notifications.map(notification => new NotificationDTO(notification));
    }
  }  