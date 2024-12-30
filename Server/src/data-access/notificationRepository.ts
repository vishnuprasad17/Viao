import { BaseRepository } from './../shared/data-access/base.repo';
import Notification from "../models/notification.model";
import { INotificationDocument } from './../interfaces/notification.interface';

class NotificationRepository extends BaseRepository<INotificationDocument> {
  constructor() {
    super(Notification);
  }

  async findAllNotifications(recipient: string,page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
      const notifications = await Notification.find({ recipient: recipient }).sort({
        createdAt: -1})
        .skip(skip)
        .limit(pageSize)
        .exec();
        
      const count = await Notification.countDocuments({ recipient: recipient })
      return { notifications, count };
   
  }

  async findUnreadNotifications(recipient: string) {
    return await Notification.find({ recipient: recipient }, { read: false });
  }
}

export default new NotificationRepository();