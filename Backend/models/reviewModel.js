const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guideRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    transportationRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    valueForMoneyRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    safetyRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    overallRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
