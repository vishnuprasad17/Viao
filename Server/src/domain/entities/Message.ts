export class Message {
    constructor(
        public readonly id: string,
        public conversationId: string,
        public senderId: string,
        public text: string,
        public imageName: string,
        public imageUrl: string,
        public isRead: boolean,
        public isDeleted: boolean,
        public deletedIds: string[],
        public createdAt:Date
    ) {}
}