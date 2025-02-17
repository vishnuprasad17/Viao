import { NotificationRepository } from "../../../domain/interfaces/infrastructure interfaces/NotificationRepository";
import { BaseRepository } from "./BaseRepository";
import { NotificationModel, INotification } from "../mongooseModels/Notification";
import { mapToDomain, mapToDatabase } from "../mappers/notificationMapper";
import { Notification } from "../../../domain/entities/Notification";
import { injectable } from "inversify";

@injectable()
export class NotificationRepositoryImpl extends BaseRepository<INotification, Notification> implements NotificationRepository {
  constructor(){
    super(NotificationModel)
  }

  // Implement mapping methods
  protected toDomain(document: INotification): Notification {
    return mapToDomain(document);
  }

  protected toDatabase(domain: Notification): Partial<INotification> {
    return mapToDatabase(domain);
  }

  async findAllNotifications(recipient: string,page: number, pageSize: number) {
      const skip = (page - 1) * pageSize;
        const notification = await NotificationModel.find({ recipient: recipient }).sort({
          createdAt: -1})
          .skip(skip)
          .limit(pageSize)
          .exec();
        const notifications = notification.map((notification) => this.toDomain(notification)); 
        const count = await NotificationModel.countDocuments({ recipient: recipient })
        return { notifications, count };
     
    }

    async changeReadStatus(id: string, status: boolean) {
      const updatedNotification = await NotificationModel.findByIdAndUpdate(id,
        { $set: { read: status }},
        { new: true}
      )

      return updatedNotification ? this.toDomain(updatedNotification) : null;
    }
  
    async findUnreadNotifications(recipient: string) {
      const notifications = await NotificationModel.find({ recipient: recipient }, { read: false });
      return notifications.map((notification) => this.toDomain(notification));
    }
}