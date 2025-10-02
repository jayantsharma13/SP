import express from 'express';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats
} from '../controllers/reviewController.js';

const router = express.Router();

// Review CRUD routes
router.get('/', getAllReviews);
router.get('/stats', getReviewStats);
router.get('/:id', getReviewById);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
