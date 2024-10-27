const express = require("express");
const { admin, protect } = require("../middleware/authMiddleware");

const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getUserBookings,
  handleCancelBooking,
} = require("../controllers/bookingController.js");

const router = express.Router();

router.post("/", protect, createBooking);
router.delete("/:bookingId/cancel", protect, handleCancelBooking);
router.get("/", protect, admin, getAllBookings);
router.route("/user").get(protect, getUserBookings);
router
  .route("/:id")
  .get(protect, getBookingById)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);
module.exports = router;
