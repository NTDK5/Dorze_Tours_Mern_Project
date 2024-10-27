const paypal = require("@paypal/checkout-server-sdk");
const { client } = require("../utils/paypalClient");
const Booking = require("../models/bookingModel");
const asyncHandler = require("express-async-handler");
const Tour = require("../models/tourModel");
const Payment = require("../models/paymentModel");
const Lodge = require("../models/lodgeModel");

// @desc Get all payments
// @route GET /api/payments
// @access Private (Admin)
const getAllPayments = asyncHandler(async (req, res) => {
  try {
    // Fetch all payments, optionally populate related fields like user and booking
    const payments = await Payment.find()
      .populate("user", "name email") // Populate user details (assuming the user model has name and email fields)
      .populate("booking", "bookingDate status totalPrice"); // Populate booking details (adjust according to your booking schema)

    // If no payments found
    if (!payments) {
      res.status(404);
      throw new Error("No payments found");
    }

    // Send the response with all payment details
    res.status(200).json(payments);
  } catch (error) {
    res.status(500);
    throw new Error("Error fetching payments");
  }
});

// @desc Create PayPal payment
// @route POST /api/payments/create
// @access Private
const createPayPalPayment = asyncHandler(async (req, res) => {
  const { bookingType, tourId, roomId, totalAmount, bookingId } = req.body;

  let itemDescription;
  let customId;

  if (bookingType === "tour") {
    const tour = await Tour.findById(tourId);
    if (!tour) {
      res.status(404);
      throw new Error("Tour not found");
    }
    itemDescription = `Booking for ${tour.title}`;
    customId = JSON.stringify({ tourId, bookingId });
  } else if (bookingType === "lodge") {
    const lodge = await Lodge.findOne({ "roomTypes._id": roomId });
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
        custom_id: customId, // Custom ID for tracking booking
      },
    ],
    application_context: {
      return_url: "http://localhost:3000/payment/success",
      cancel_url: "http://localhost:3000/payment/cancel",
    },
  });

  try {
    const order = await client().execute(request);
    const userId = req.user._id; // Assuming user is authenticated

    // Create a payment record
    const payment = await Payment.create({
      booking: bookingId,
      user: userId,
      amount: totalAmount,
      paymentMethod: "paypal",
      paymentStatus: "pending",
      transactionId: order.result.id, // Store PayPal order ID here
      bookingType: bookingType,
    });

    // Update the booking with the paymentId
    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.paymentId = payment._id;
      await booking.save();
    } else {
      throw new Error("Booking not found");
    }

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
  console.log(webhookEvent);

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
    // Ensure custom_id is defined before parsing
    if (webhookEvent.resource.custom_id) {
      const customIdObj = JSON.parse(webhookEvent.resource.custom_id);
      tourId = customIdObj.tourId;
      roomId = customIdObj.roomId;
      bookingId = customIdObj.bookingId;
    } else {
      throw new Error("Missing custom_id in webhook event");
    }

    // Find and update the booking by ID
    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.status = "confirmed";
      booking.paymentResult = webhookEvent.resource; // Store the full webhook event for future reference
      await booking.save();
    } else {
      console.error("Booking not found for ID:", bookingId);
      return;
    }

    // Ensure supplementary_data exists before accessing order_id
    const relatedIds = webhookEvent.resource.supplementary_data?.related_ids;
    if (relatedIds?.order_id) {
      // Find and update the payment by order ID
      const payment = await Payment.findOne({
        transactionId: relatedIds.order_id, // Use order ID to find the initial payment
      });
      if (payment) {
        payment.transactionId = captureId; // Now store the capture ID
        payment.paymentStatus = "completed";
        await payment.save();
      } else {
        console.error("Payment not found for order ID:", relatedIds.order_id);
        return;
      }
    } else {
      console.error("Missing order_id in supplementary_data");
      return;
    }
  } catch (error) {
    console.error("Error handling webhook event:", error);
  }
};

// @desc Handle payment refund completed
const handlePaymentRefunded = async (webhookEvent) => {
  const captureId = webhookEvent.resource.id; // This should be the correct capture ID
  const bookingId = webhookEvent.resource.invoice_id; // Ensure this is correct

  const payment = await Payment.findOne({ captureId });
  console.log(payment); // Look up by captureId
  if (!payment) {
    console.error("Payment not found for captureId:", captureId);
    return; // Early return if payment does not exist
  }

  const booking = await Booking.findById(bookingId);
  if (booking) {
    booking.status = "refunded";
    await booking.save();
  } else {
    console.error("Booking not found for ID:", bookingId);
  }
};

// @desc Validate PayPal webhook (optional but recommended)
const validateWebhook = async (headers, body) => {
  // Implement webhook validation logic using PayPal's API or signature verification
  return true; // For now, assume it's valid
};

module.exports = { createPayPalPayment, handlePayPalWebhook, getAllPayments };
