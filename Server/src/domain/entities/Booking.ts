export class Booking {
    constructor(
        public readonly id: string,
        public name: string,
        public date: string,
        public eventName: string,
        public city: string,
        public pin:number,
        public mobile:number,
        public vendorId: string,
        public userId: string,
        public status:string,
        public payment_status:string,
        public amount:number,
        public refundAmount:number,
        public createdAt: Date,
        public vendorName?:string
    ) {}
}