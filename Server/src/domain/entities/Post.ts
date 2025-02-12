export class Post {
    constructor(
        public readonly id: string,
        public caption: string,
        public vendor_id: string,
        public image: string,
        public imageUrl: string
    ) {}
}