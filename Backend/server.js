require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes.js");
const tourRoutes = require("./routes/tourRoutes.js");
const bookingRoutes = require("./routes/bookingRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const lodgeRoutes = require("./routes/lodgeRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const path = require("path");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE", // Frontend URL
    credentials: true, // Allow credentials (cookies)
  })
);

app.use(morgan("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handles URL encoded data
app.use(cookieParser());
app.set("trust proxy", true);

// Using Express.js
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "same-site"); // or 'cross-origin' if served from a different domain
    next();
  },
  express.static("uploads")
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  keyGenerator: (req) => req.ip,
});
app.use(limiter);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/lodge", lodgeRoutes);
app.use(notFound);
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
