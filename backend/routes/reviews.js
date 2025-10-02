import express from "express";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats,
} from "../controllers/reviewController.js";
import authentication from "../middleware/authentication.js";

const router = express.Router();

// Review CRUD routes
router.get("/", getAllReviews);
router.get("/stats", getReviewStats);
router.get("/:id", getReviewById);
router.post("/", authentication, createReview);
router.put("/:id", authentication, updateReview);
router.delete("/:id", authentication, deleteReview);

export default router;
