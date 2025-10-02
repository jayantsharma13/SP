import { Router } from "express";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats,
} from "../controllers/reviewController.js";
import authentication from "../middleware/authentication.js";
import authorization from "../middleware/Authorization.js";

const reviewRouter = Router();

// Public routes
reviewRouter.get("/", getAllReviews);
reviewRouter.get("/stats", getReviewStats);
reviewRouter.get("/:id", getReviewById);

// Protected routes
reviewRouter.post("/", authentication, createReview);
reviewRouter.put("/:id", authentication, updateReview);
reviewRouter.delete(
  "/:id",
  authentication,
  authorization("admin"),
  deleteReview
);

export default reviewRouter;
