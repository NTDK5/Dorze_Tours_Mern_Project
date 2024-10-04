const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour", // Reference to the Tour model
    },
    lodge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lodge", // Reference to the Lodge model
    },
    bookingType: {
      type: String,
      enum: ["Tour", "Lodge"], // Type of booking: Tour or Lodge
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
      default: Date.now, // Defaults to the current date/time
    },
    numberOfPeople: {
      type: Number,
      required: true,
      min: 1, // At least 1 person must be booked
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0, // The price should be at least 0
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled"], // Status options
      default: "pending", // Default status is pending
    },
    paymentMethod: {
      type: String,
      enum: ["credit card", "paypal", "bank transfer"], // Possible payment methods
      required: true,
    },
    notes: {
      type: String,
      maxlength: 500, // Optional notes with a maximum length
    },
    checkInDate: {
      type: Date,
      required: function () {
        return this.bookingType === "Lodge"; // Only required for Lodge bookings
      },
    },
    checkOutDate: {
      type: Date,
      required: function () {
        return this.bookingType === "Lodge"; // Only required for Lodge bookings
      },
    },
    roomType: {
      type: String,
      required: function () {
        return this.bookingType === "Lodge"; // Only required for Lodge bookings
      },
    },
  },
  {
    timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
  }
);

// Adding a validation to ensure either tour or lodge is booked
bookingSchema.pre("save", function (next) {
  if (!this.tour && !this.lodge) {
    throw new Error(
      "A booking must be associated with either a tour or a lodge."
    );
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
