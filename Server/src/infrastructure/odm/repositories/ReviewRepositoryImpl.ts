import { ReviewRepository } from "../../../domain/interfaces/infrastructure interfaces/ReviewRepository";
import { BaseRepository } from "./BaseRepository";
import { ReviewModel, IReview} from "../mongooseModels/Review";
import { mapToDatabase, mapToDomain, mapToDomainPopulate } from "../mappers/reviewMapper";
import { Review } from "../../../domain/entities/Review";
import { injectable } from "inversify";

@injectable()
export class ReviewRepositoryImpl extends BaseRepository<IReview, Review> implements ReviewRepository {
  constructor() {
    super(ReviewModel);
  }

  // Implement mapping methods
  protected toDomain(document: IReview): Review {
    return mapToDomain(document);
  }

  protected toDatabase(domain: Review): Partial<IReview> {
    return mapToDatabase(domain);
  }

  async addReply(content: string, id: string) {
    const data = await ReviewModel.findByIdAndUpdate(id,
      { $push: { reply: content }},
      { new: true }
    );
    return data ? this.toDomain(data) : null;
  }

  async getReviewsByVendorId(vendorId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const documents = await ReviewModel.find({ vendorId: vendorId })
      .populate("vendorId")
      .populate("userId")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageSize);
    const reviews = documents.map((document) => mapToDomainPopulate(document));
    const count = await ReviewModel.countDocuments({ vendorId: vendorId });
    return { reviews, count };
  }
}