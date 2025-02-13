const asyncHandler = require("express-async-handler");
const Booking = require("../models/bookingModel.js");
const Tour = require("../models/tourModel.js");
const Lodge = require("../models/lodgeModel.js");
const User = require("../models/userModel.js");
const cron = require("node-cron");
const paypal = require("@paypal/checkout-server-sdk");
const { client } = require("../utils/paypalClient");
const Car = require("../models/carModel.js");

// @desc Create a new booking
// @route POST /api/bookings
// @access Private
const createBooking = asyncHandler(async (req, res) => {
  const {
    bookingType,
    tourId,
    lodgeId,
    carId,
    numberOfPeople = 1,
    paymentMethod,
    notes,
    checkInDate,
    checkOutDate,
    roomType,
    pickupLocation,
    dropoffLocation,
    bookingDate
  } = req.body;

  const userId = req.user._id;
  let totalPrice = 0;
  let bookingDetails = {};

  // Validate booking type
  if (!["Tour", "Lodge", "Car"].includes(bookingType)) {
    res.status(400);
    throw new Error("Invalid booking type");
  }

  // Handle Tour booking
  if (bookingType === "Tour") {
    const tour = await Tour.findById(tourId);
    if (!tour) {
      res.status(404);
      throw new Error("Tour not found");
    }
    totalPrice = tour.price * numberOfPeople;
    bookingDetails = {
      tour: tourId,
      bookingDate: bookingDate || new Date()
    };
  }

  // Handle Lodge booking
  else if (bookingType === "Lodge") {
    const lodge = await Lodge.findById(lodgeId);
    if (!lodge) {
      res.status(404);
      throw new Error("Lodge not found");
    }

    const selectedRoomType = lodge.roomTypes.find(
      (room) => room.type === roomType
    );
    if (!selectedRoomType) {
      res.status(400);
      throw new Error("Invalid room type selected");
    }

    const numberOfNights = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );

    totalPrice = selectedRoomType.price * numberOfNights;
    bookingDetails = {
      lodge: lodgeId,
      checkInDate,
      checkOutDate,
      roomType
    };
  }

  // Handle Car booking
  else if (bookingType === "Car") {
    const car = await Car.findById(carId);
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }
    if (!car.available) {
      res.status(400);
      throw new Error("Car is not available for booking");
    }

    if (!pickupLocation || !dropoffLocation) {
      res.status(400);
      throw new Error("Pickup and dropoff locations are required for car bookings");
    }

    if (!checkInDate || !checkOutDate) {
      res.status(400);
      throw new Error("Check-in and check-out dates are required for car bookings");
    }

    const numberOfDays = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );

    if (numberOfDays <= 0) {
      res.status(400);
      throw new Error("Invalid booking duration");
    }

    totalPrice = car.pricePerDay * numberOfDays;
    bookingDetails = {
      car: carId,
      checkInDate,
      checkOutDate,
      pickupLocation,
      dropoffLocation
    };

    // Update car availability
    // car.available = false;
    await car.save();
  }

  // Create the booking
  const booking = await Booking.create({
    user: userId,
    bookingType,
    numberOfPeople,
    totalPrice,
    paymentMethod: paymentMethod || 'credit card',
    notes,
    status: 'pending',
    ...bookingDetails
  });

  // Populate relevant details based on booking type
  await booking.populate({
    path: bookingType.toLowerCase(),
    select: bookingType === 'Tour' ? 'title destination price' :
      bookingType === 'Lodge' ? 'name location roomTypes' :
        'brand model year transmission fuelType seats pricePerDay'
  });


  res.status(201).json(booking);
});

// @desc Get all bookings
// @route GET /api/bookings
// @access Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "first_name last_name email")
    .populate("tour", "title destination")
    .populate("lodge", "name location")
    .populate("car", "brand model year transmission fuelType seats pricePerDay");
  res.status(200).json(bookings);
});

// @desc Get a booking by ID
// @route GET /api/bookings/:id
// @access Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "first_name last_name email")
    .populate("tour", "title destination")
    .populate("lodge", "name location")
    .populate("car", "brand model year transmission fuelType seats pricePerDay");

  if (booking) {
    res.status(200).json(booking);
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

// @desc Update a booking
// @route PUT /api/bookings/:id
// @access Private/Admin
const updateBooking = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (booking) {
    booking.status = status || booking.status;
    booking.notes = notes || booking.notes;

    const updatedBooking = await booking.save();
    res.status(200).json(updatedBooking);
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

// @desc Delete a booking
// @route DELETE /api/bookings/:id
// @access Private/Admin
const deleteBooking = asyncHandler(async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (booking) {
      res.status(200).json({ message: "Booking removed" });
    } else {
      res.status(404);
      throw new Error("Booking not found");
    }
  } catch (error) {
    console.error("Error deleting Booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc Get user bookings
// @route GET /api/bookings/user
// @access Private
const getUserBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const userBookings = await Booking.find({ user: userId })
    .populate("tour", "title destination")
    .populate("lodge", "name location")
    .populate("user", "first_name last_name email")
    .populate("car", "brand model year transmission fuelType seats pricePerDay");


  if (userBookings.length > 0) {
    res.status(200).json(userBookings);
  } else {
    res.status(404);
    throw new Error("No bookings found for this user");
  }
});
// @desc Cancel bookings
// @route DELETE /api/bookings/:bookingId/cancel
// @access Private
const handleCancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId).populate("paymentId");
  console.log(bookingId);
  console.log(booking);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Ensure booking has a paymentId and status is confirmed
  if (booking.status === "confirmed" && booking.paymentId) {
    const captureId = booking.paymentId.transactionId; // Use the transactionId as the captureId
    console.log("capture id:", captureId);
    // Ensure you have a valid capture ID before proceeding
    if (!captureId) {
      return res.status(400).json({ message: "Capture ID not found" });
    }

    // Log the capture ID
    console.log("Attempting to refund capture ID:", captureId);

    const request = new paypal.payments.CapturesRefundRequest(captureId);

    try {
      // Fetch capture details to check status
      const captureDetailsRequest = new paypal.payments.CapturesGetRequest(
        captureId
      );
      const captureDetailsResponse = await client().execute(
        captureDetailsRequest
      );
      console.log("Capture details:", captureDetailsResponse);

      // Process the refund if the capture is valid
      const refund = await client().execute(request);
      booking.status = "refunded";
      await booking.save();
      return res.status(200).json({ message: "Booking canceled and refunded" });
    } catch (error) {
      console.error("Error processing refund:", error);
      return res.status(500).json({ message: "Refund failed" });
    }
  } else {
    // Cancel without refund
    booking.status = "canceled";
    await booking.save();

    return res.status(200).json({ message: "Booking canceled" });
  }
};

// Function to check and cancel expired bookings
const checkAndCancelExpiredBookings = async () => {
  const now = new Date();
  const bookings = await Booking.find({
    status: "pending",
    createdAt: { $lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
  });

  for (const booking of bookings) {
    booking.status = "cancelled";
    await booking.save();
  }

  console.log("Checked and cancelled expired bookings");
};

// Schedule the task to run every hour
cron.schedule("0 * * * *", checkAndCancelExpiredBookings);

// Run the task immediately when the server starts
checkAndCancelExpiredBookings();

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getUserBookings,
  handleCancelBooking,
};
