import notificationRepository from "../data-access/notificationRepository";
import { BaseError } from "../shared/error/base.error";

class NotificationService {
  async getNotifications(recipient: string,page: number, pageSize: number) {
    try {
      return await notificationRepository.findAllNotifications(recipient, page, pageSize);
     
    } catch (error) {
      console.error("Error in getNotifications:", error);
      throw new BaseError("Failed to fetch notifications.", 500);
    }
  }

  async getUnreadNotifications(recipient: string) {
    try {
      const data = await notificationRepository.findUnreadNotifications(
        recipient
      );
      return data;
    } catch (error) {
      console.error("Error in getUnreadNotifications:", error);
      throw new BaseError("Failed to fetch unread notifications.", 500);
    }
  }

  async getNotificationForAdmin(adminId: string) {
    try {
      const data = await notificationRepository.findByCondition({
        recipient: adminId,
      });
      return data;
    } catch (error) {
      console.error("Error in getNotificationForAdmin:", error);
      throw new BaseError("Failed to fetch notifications for admin.", 500);
    }
  }

  async changeReadStatus(id: string, recipient: string) {
    try {
      const notificationItem = await notificationRepository.getById(id);
      if (!notificationItem) {
        throw new BaseError("Notification not found.", 404);
      }
      notificationItem.read = !notificationItem.read;
      await notificationItem.save();

      return await notificationRepository.findByCondition({
        recipient: recipient,
      });
    } catch (error) {
      console.error("Error in changeReadStatus:", error);
      throw new BaseError("Failed to change read status.", 500);
    }
  }

  async delete(_id: string) {
    try {
      const notificationItem = await notificationRepository.getById(_id);
      if (!notificationItem) {
        throw new BaseError("Notification not found.", 404);
      }

      return await notificationRepository.delete(_id);
    } catch (error) {
      console.error("Error in deleteNotification:", error);
      throw new BaseError("Failed to delete notification.", 500);
    }
  }
}

export default new NotificationService();