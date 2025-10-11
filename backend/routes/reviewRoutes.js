import { Router } from "express";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats,
  getMyReviews,
  getUserReviews,
} from "../controllers/reviewController/index.js";
import authentication from "../middleware/authentication.js";
import authorization from '../middleware/Authorization.js';

const reviewRouter = Router();

// Public routes (specific routes before parameterized ones)
reviewRouter.get("/", getAllReviews);
reviewRouter.get("/stats", getReviewStats);
reviewRouter.get("/user/:userId", getUserReviews); // Get reviews by specific user

// Protected routes (require authentication)
reviewRouter.get("/me", authentication, getMyReviews); // Get logged-in user's reviews
reviewRouter.post("/", authentication, createReview);
reviewRouter.put("/:id", authentication, updateReview);
reviewRouter.delete("/:id", authentication, authorization('admin'), deleteReview);

// Public route - must come after other specific routes to avoid conflicts
reviewRouter.get("/:id", getReviewById);

export default reviewRouter;
