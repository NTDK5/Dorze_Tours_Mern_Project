const express = require("express");
const {
  handlePayPalWebhook,
  createPayPalPayment,
  getAllPayments,
  initializePayment,
  verifyPayment,
  deletePayment
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/webhook", handlePayPalWebhook);
router.post("/create-paypal-payment", protect, createPayPalPayment);
router.get("/", protect, getAllPayments);
router.post('/create', protect, initializePayment);
router.get('/verify/:txRef', protect, verifyPayment);
router.delete("/:id", deletePayment);
module.exports = router;
