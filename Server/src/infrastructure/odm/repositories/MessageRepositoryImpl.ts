import { MessageRepository } from "../../../domain/interfaces/infrastructure interfaces/MessageRepository";
import { BaseRepository } from "./BaseRepository";
import { MessageModel, IMessage } from "../mongooseModels/Message";
import { mapToDomain, mapToDatabase } from "../mappers/messageMapper";
import { Message } from "../../../domain/entities/Message";
import { injectable } from "inversify";
import { UpdateWriteOpResult } from "mongoose";

@injectable()
export class MessageRepositoryImpl
  extends BaseRepository<IMessage, Message>
  implements MessageRepository
{
  constructor() {
    super(MessageModel);
  }

  // Implement mapping methods
  protected toDomain(document: IMessage): Message {
    return mapToDomain(document);
  }

  protected toDatabase(domain: Message): Partial<IMessage> {
    return mapToDatabase(domain);
  }

  async changeMessageView(msgId: string, id: string): Promise<Message | null> {
    const document = await MessageModel.findByIdAndUpdate(
      msgId,
      { $push: { deletedIds: id } },
      { returnDocument: "after" },
    );

    return document ? this.toDomain(document) : null;
  }

  async updateReadStatus(
    chatId: string,
    viewerId: string,
  ): Promise<UpdateWriteOpResult> {
    const status = await MessageModel.updateMany(
      {
        conversationId: chatId,
        senderId: { $ne: viewerId },
        isRead: false,
      },
      { $set: { isRead: true } },
    );
    return status;
  }

  async findMessagesWithPagination(
    conversationId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<Message[]> {
    const skip = (page - 1) * limit;
    const sortOption: Record<string, -1> = {
      createdAt: -1,
    };

    const documents = await MessageModel.find({ conversationId })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return documents.reverse().map(this.toDomain);
  }

  async findLastVisibleMessage(
    conversationId: string,
    excludeUserId?: string,
  ): Promise<Message | null> {
    const query: Record<string, any> = {
      conversationId,
      isDeleted: false,
    };

    if (excludeUserId) {
      query.deletedIds = { $nin: [excludeUserId] };
    }

    const document = await MessageModel.findOne(query)
      .sort({ createdAt: -1 })
      .limit(1);

    return document ? this.toDomain(document) : null;
  }
}
