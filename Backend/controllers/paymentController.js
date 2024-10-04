const paypal = require("@paypal/checkout-server-sdk");
const { client } = require("../utils/paypalClient");
const Booking = require("../models/bookingModel");
const asyncHandler = require("express-async-handler");
const Tour = require("../models/tourModel");
const Payment = require("../models/paymentModel");
const Lodge = require("../models/lodgeModel");
//@desc create paypal payment
// @route POST /api/payments/create
// @access Private
const createPayPalPayment = asyncHandler(async (req, res) => {
  const { bookingType, tourId, roomId, totalAmount, bookingId } = req.body;

  let itemDescription;
  let customId;

  if (bookingType === "tour") {
    // Fetch the tour information
    const tour = await Tour.findById(tourId);
    if (!tour) {
      res.status(404);
      throw new Error("Tour not found");
    }
    itemDescription = `Booking for ${tour.title}`;
    customId = JSON.stringify({ tourId, bookingId });
  } else if (bookingType === "lodge") {
    console.log(roomId);
    // Fetch the lodge room information
    const lodge = await Lodge.findOne({ "roomTypes._id": roomId });
    console.log(lodge);
    if (!lodge) {
      res.status(404);
      throw new Error("Lodge not found");
    }
    const room = lodge.roomTypes.id(roomId);
    itemDescription = `Room Booking: ${room.type} at ${lodge.name}`;
    customId = JSON.stringify({ roomId, bookingId });
  } else {
    res.status(400);
    throw new Error("Invalid booking type");
  }

  console.log("Total Price:", totalAmount); // Debugging line

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: totalAmount.toString(),
        },
        description: itemDescription,
        custom_id: customId, // Save both IDs
      },
    ],
    application_context: {
      return_url: "http://localhost:3000/payment/success",
      cancel_url: "http://localhost:3000/payment/cancel",
    },
  });

  try {
    const order = await client().execute(request);
    const userId = req.user._id; // Assuming the user is authenticated and `req.user` is available

    // Create a payment record in the database
    const payment = await Payment.create({
      booking: bookingId,
      user: userId,
      amount: totalAmount,
      paymentMethod: "paypal",
      paymentStatus: "pending",
      transactionId: order.result.id,
      bookingType: bookingType,
    });

    res.status(201).json({
      id: order.result.id,
      status: order.result.status,
      links: order.result.links,
      payment, // Include the payment details in the response
    });
  } catch (error) {
    console.error("PayPal payment creation failed:", error);
    res.status(500);
    throw new Error("Payment creation failed");
  }
});

// @desc Handle PayPal webhook events
// @route POST /api/payments/webhook
// @access Public
const handlePayPalWebhook = async (req, res) => {
  const webhookEvent = req.body;
  console.log("Webhook received:", webhookEvent);

  try {
    // Validate the webhook (optional but recommended)
    const isValid = await validateWebhook(req.headers, req.body);
    if (!isValid) {
      return res.status(400).send("Invalid Webhook");
    }

    // Handle different event types from PayPal
    switch (webhookEvent.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        await handlePaymentCaptureCompleted(webhookEvent);
        break;
      case "PAYMENT.CAPTURE.REFUNDED":
        await handlePaymentRefunded(webhookEvent);
        break;
      // Add more event types as needed
      default:
        console.log(`Unhandled event type: ${webhookEvent.event_type}`);
    }

    // Respond with 200 OK and include the webhook event data
    res.status(200).json({
      message: "Webhook received",
      webhookEvent,
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Internal Server Error");
  }
};

const handlePaymentCaptureCompleted = async (webhookEvent) => {
  const captureId = webhookEvent.resource.id;
  let tourId, roomId, bookingId;

  try {
    // Try parsing custom_id if it's in JSON format
    const customIdObj = JSON.parse(webhookEvent.resource.custom_id);
    tourId = customIdObj.tourId;
    roomId = customIdObj.roomId;
    bookingId = customIdObj.bookingId;
  } catch (error) {
    console.error("Error parsing custom_id:", error);
    // Handle the case where custom_id is not in expected JSON format
    return;
  }

  console.log(
    "Parsed bookingId, tourId, and roomId:",
    bookingId,
    tourId,
    roomId
  );

  // Find the booking by ID
  const booking = await Booking.findById(bookingId);
  if (booking) {
    booking.status = "confirmed";
    booking.paymentResult = webhookEvent.resource;
    await booking.save();
  }

  // Find and update the payment
  const payment = await Payment.findOne({ transactionId: captureId });
  if (payment) {
    payment.paymentStatus = "completed";
    await payment.save();
  }
};

// @desc Handle payment refund completed
const handlePaymentRefunded = async (webhookEvent) => {
  const captureId = webhookEvent.resource.id;
  const bookingId = webhookEvent.resource.invoice_id; // Assuming booking ID was passed as invoice_id

  const booking = await Booking.findById(bookingId);
  if (booking) {
    booking.status = "refunded";
    await booking.save();
  }
};

// @desc Validate PayPal webhook (optional but recommended)
const validateWebhook = async (headers, body) => {
  // Implement webhook validation logic using PayPal's API or signature verification
  return true; // For now, assume it's valid
};

module.exports = { createPayPalPayment, handlePayPalWebhook };
