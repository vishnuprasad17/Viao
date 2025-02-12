export class Conversation {
    constructor(
        public readonly id:string,
        public members: string[],
        public updatedAt?: Date,
        public createdAt?: Date,
        public recentMessage?: string
    ) {}
}