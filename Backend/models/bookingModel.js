const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
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
      enum: ["Tour", "Lodge", "Car"],
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
      enum: ["pending", "confirmed", "cancelled", "refunded"], // Status options
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
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
    },
    pickupLocation: {
      type: String,
      required: function () {
        return this.bookingType === "Car";
      }
    },
    dropoffLocation: {
      type: String,
      required: function () {
        return this.bookingType === "Car";
      }
    }
  },
  {
    timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
  }
);

// Update the validation to include car bookings
bookingSchema.pre("save", function (next) {
  if (!this.tour && !this.lodge && !this.car) {
    throw new Error(
      "A booking must be associated with either a tour, lodge, or car."
    );
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
