const asyncHandler = require("express-async-handler");
const Review = require("../models/reviewModel.js");
const Tour = require("../models/tourModel.js");

// @desc create a new review
// @route Post /api/reviews
//@acess private
const createReview = asyncHandler(async (req, res) => {
  try {
    const {
      tourId,
      guideRating,
      transportationRating,
      valueForMoneyRating,
      safetyRating,
      comment,
    } = req.body;

    if (
      !tourId ||
      !guideRating ||
      !transportationRating ||
      !valueForMoneyRating ||
      !safetyRating
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const guide = Number(guideRating);
    const transport = Number(transportationRating);
    const value = Number(valueForMoneyRating);
    const safety = Number(safetyRating);

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const reviewExists = await Review.findOne({
      tour: tourId,
      user: req.user._id,
    });
    if (reviewExists) {
      return res.status(400).json({ message: "Review already exists" });
    }

    const overallRating = (guide + transport + value + safety) / 4;
    if (overallRating < 0 || overallRating > 5) {
      return res
        .status(400)
        .json({ message: "Calculated overall rating must be between 0 and 5" });
    }

    const review = await Review.create({
      tour: tourId,
      user: req.user._id,
      guideRating: guide,
      transportationRating: transport,
      valueForMoneyRating: value,
      safetyRating: safety,
      overallRating: overallRating.toFixed(1),
      comment: comment,
    });

    // Update the tour's average rating
    const newTotalRatings = tour.totalRatings + 1;
    const newAverageRating =
      (tour.averageRating * tour.totalRatings + overallRating) /
      newTotalRatings;

    tour.averageRating = newAverageRating.toFixed(1);
    tour.totalRatings = newTotalRatings;
    await tour.save();

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Get all reviews for a specfic tour
//@ route GET /api/reviews/:tourId
// @acess Public

const getReviewsByTour = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ tour: req.params.tourId })
    .populate("user", "first_name last_name country")
    .skip(skip)
    .limit(limit);

  const totalReviews = await Review.countDocuments({ tour: req.params.tourId });

  if (!reviews) {
    res.status(404);
    throw new Error("No Reviews Found");
  }

  res.status(200).json({
    reviews,
    page,
    pages: Math.ceil(totalReviews / limit),
    totalReviews,
  });
});

//@desc Delete a review
// @route DELETE /api/reviews/:id
//@access private

const deleteReview = asyncHandler(async (req, res) => {
  try {
    // Find and delete the review
    const review = await Review.findByIdAndDelete(req.params.id);

    if (review) {
      // Uncomment this block if you want to check if the user is authorized to delete the review
      // if (review.user.toString() !== req.user._id.toString()) {
      //   res.status(401);
      //   throw new Error("Not authorized to delete this review");
      // }

      res.status(200).json({ message: "Review removed" });
    } else {
      res.status(404);
      throw new Error("Review not found");
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = {
  createReview,
  getReviewsByTour,
  deleteReview,
};
