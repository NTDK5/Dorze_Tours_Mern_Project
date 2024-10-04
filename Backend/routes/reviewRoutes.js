const express = require("express");
const {
  createReview,
  getReviewsByTour,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createReview);
router.route("/:tourId").get(getReviewsByTour);
router.route("/:id").delete(protect, deleteReview);

module.exports = router;
