import { injectable } from "inversify";
import { NotificationService } from "../../domain/interfaces/NotificationService";
import { Notification } from "../../domain/entities/Notification";

@injectable()
export class NotificationServiceImpl implements NotificationService {
  async createNotification(id: string, message: string, type: string): Promise<Notification> {
    const data = new Notification(
      "",
      id,
      message,
      false,
      type,
      new Date()
    );
    return data;
  }
}