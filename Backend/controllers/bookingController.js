const asyncHandler = require("express-async-handler");
const Booking = require("../models/bookingModel.js");
const Tour = require("../models/tourModel.js");
const Lodge = require("../models/lodgeModel.js");
const User = require("../models/userModel.js");

// @desc Create a new booking
// @route POST /api/bookings
// @access Private
const createBooking = asyncHandler(async (req, res) => {
  const {
    bookingType,
    tourId,
    lodgeId,
    numberOfPeople,
    paymentMethod,
    notes,
    checkInDate,
    checkOutDate,
    roomType, // New field for room type
  } = req.body;
  const userId = req.user._id; // Assuming the user is authenticated and `req.user` is available

  let totalPrice = 0;
  let bookingDetails;

  if (bookingType === "Tour") {
    // Validate the tour
    const tour = await Tour.findById(tourId);
    if (!tour) {
      res.status(404);
      throw new Error("Tour not found");
    }

    // Calculate total price for the tour
    totalPrice = tour.price * numberOfPeople;
    bookingDetails = { tour: tourId };
  } else if (bookingType === "Lodge") {
    // Validate the lodge
    const lodge = await Lodge.findById(lodgeId);
    if (!lodge) {
      res.status(404);
      throw new Error("Lodge not found");
    }

    // Find the selected room type
    const selectedRoomType = lodge.roomTypes.find(
      (room) => room.type === roomType
    );
    if (!selectedRoomType) {
      res.status(400);
      throw new Error("Invalid room type selected");
    }

    console.log(selectedRoomType);
    // Calculate total price for the lodge (assuming lodge.price is per room/night)
    const numberOfNights = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
    totalPrice = selectedRoomType.price * numberOfNights;
    console.log(totalPrice);
    bookingDetails = { lodge: lodgeId, checkInDate, checkOutDate, roomType }; // Include check-in/out and room type
  } else {
    res.status(400);
    throw new Error("Invalid booking type");
  }

  // Create the booking
  const booking = await Booking.create({
    user: userId,
    bookingType,
    numberOfPeople,
    totalPrice,
    paymentMethod,
    notes,
    ...bookingDetails,
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
    .populate("lodge", "name location");
  res.status(200).json(bookings);
});

// @desc Get a booking by ID
// @route GET /api/bookings/:id
// @access Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "first_name last_name email")
    .populate("tour", "title destination")
    .populate("lodge", "name location");

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
  const userId = req.user._id; // Assuming `req.user` contains the authenticated user's information

  const userBookings = await Booking.find({ user: userId })
    .populate("tour", "title destination") // Populating tour details
    .populate("lodge", "name location") // Populating lodge details
    .populate("user", "first_name last_name email"); // Populating user details (optional)

  if (userBookings.length > 0) {
    res.status(200).json(userBookings);
  } else {
    res.status(404);
    throw new Error("No bookings found for this user");
  }
});

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getUserBookings,
};
