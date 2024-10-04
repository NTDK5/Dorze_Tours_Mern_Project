const express = require("express");
const {
  handlePayPalWebhook,
  createPayPalPayment,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/webhook", handlePayPalWebhook);
router.post("/create", protect, createPayPalPayment);

module.exports = router;
