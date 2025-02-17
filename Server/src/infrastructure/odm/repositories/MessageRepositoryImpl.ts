import { MessageRepository } from "../../../domain/interfaces/infrastructure interfaces/MessageRepository";
import { BaseRepository } from "./BaseRepository";
import { MessageModel, IMessage } from "../mongooseModels/Message";
import { mapToDomain, mapToDatabase } from "../mappers/messageMapper";
import { Message } from "../../../domain/entities/Message";
import { injectable } from "inversify";
import { UpdateWriteOpResult } from "mongoose";

@injectable()
export class MessageRepositoryImpl extends BaseRepository<IMessage, Message> implements MessageRepository {
  constructor(){
    super(MessageModel)
  }

  // Implement mapping methods
  protected toDomain(document: IMessage): Message {
    return mapToDomain(document);
  }

  protected toDatabase(domain: Message): Partial<IMessage> {
    return mapToDatabase(domain);
  }

  async changeMessageView(msgId: string, id: string): Promise<Message | null> {
    const document = await MessageModel.findByIdAndUpdate(msgId,
        { $push: { deletedIds: id } },
        { new: true }
    );

    return document? this.toDomain(document) : null;
  }

  async updateReadStatus(chatId:string,senderId:string): Promise<UpdateWriteOpResult>{
    const status =  await MessageModel.updateMany({conversationId:chatId,senderId:senderId},{$set:{isRead:true}});

    return status;
  }

}