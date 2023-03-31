import { AppDataSource } from '../dataSource';
import { Review } from '../entities/Review';

const reviewRepository = AppDataSource.getRepository(Review);

async function deleteReviewById(reviewId: string): Promise<void> {
  await reviewRepository
    .createQueryBuilder('review')
    .delete()
    .from(Review)
    .where('reviewId = :reviewId', { reviewId })
    .execute();
}

export { deleteReviewById };
