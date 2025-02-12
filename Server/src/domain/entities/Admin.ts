export class Admin {
    constructor(
        public readonly id: string,
        public email: string,
        public wallet: number,
        public createdAt: Date,
    ) {}
}