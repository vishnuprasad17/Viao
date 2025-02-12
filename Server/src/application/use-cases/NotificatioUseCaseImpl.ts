import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { NotificationRepository } from "../../domain/interfaces/NotificationRepository";
import { NotificationUseCase } from "../../domain/interfaces/NotificationUseCase";
import { Notification } from "../../domain/entities/Notification";
import { BaseError } from "../../domain/errors/BaseError";


@injectable()
export class NotificationUseCaseImpl implements NotificationUseCase {
    constructor(@inject(TYPES.NotificationRepository) private notificationRepository: NotificationRepository) {}

    async getNotifications(recipient: string,page: number, pageSize: number): Promise<{notification: Notification[],totalPages: number}> {
        const { notifications, count} = await this.notificationRepository.findAllNotifications(recipient, page, pageSize);
        const totalPages = Math.ceil(count / pageSize);
        
        return {notification:notifications,totalPages: totalPages};
      }
    
    async getUnreadNotifications(recipient: string): Promise<number> {
          const data = await this.notificationRepository.findUnreadNotifications(
            recipient
          );
          return data.length;
      }
    
    async getNotificationForAdmin(adminId: string): Promise<Notification[]> {
        const data = await this.notificationRepository.findByCondition({
          recipient: adminId,
        });
        return data;
    }
    
    async changeReadStatus(id: string, recipient: string): Promise<Notification[]> {
        const notificationItem = await this.notificationRepository.getById(id);
        if (!notificationItem) {
          throw new BaseError("Notification not found.", 404);
        }
        const readStatus = !notificationItem.read;
        await this.notificationRepository.changeReadStatus(notificationItem.id, readStatus);
    
        return await this.notificationRepository.findByCondition({
          recipient: recipient,
        });
      }
    
    async delete(id: string): Promise<Notification> {
        const notificationItem = await this.notificationRepository.getById(id);
        if (!notificationItem) {
          throw new BaseError("Notification not found.", 404);
        }
        const deletedNotification = await this.notificationRepository.delete(id);
        if (!deletedNotification) {
            throw new BaseError("Failed to delete notification.", 500);
        }

        return deletedNotification;
      }
}