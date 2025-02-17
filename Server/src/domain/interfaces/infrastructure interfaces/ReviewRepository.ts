import { Review } from "../../entities/Review";

export interface ReviewRepository {
    create(review: Review): Promise<Review>;
    findByCondition(condition: Record<string, unknown>): Promise<Review[]>;
    update(id: string, user: Partial<Review>): Promise<Review | null>;
    getById(id: string): Promise<Review | null>;
    findOne(condition: Record<string, unknown>): Promise<Review | null>;
    delete(id:string):Promise<Review |null>;

    addReply(content: string, id: string): Promise<Review | null>;
    getReviewsByVendorId(vendorId: string, page: number, pageSize: number): Promise<{ reviews: Review[], count: number }>;
}