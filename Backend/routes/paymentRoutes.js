const express = require("express");
const {
  handlePayPalWebhook,
  createPayPalPayment,
  getAllPayments,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/webhook", handlePayPalWebhook);
router.post("/create", protect, createPayPalPayment);
router.get("/", protect, getAllPayments);

module.exports = router;
