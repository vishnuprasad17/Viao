export class Notification {
    constructor(
        public readonly id: string,
        public recipient: string,
        public message: string,
        public read: boolean,
        public type: string,
        public createdAt: Date
    ) {}
}