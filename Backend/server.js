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
const carRoutes = require("./routes/carRoutes.js")
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const path = require("path");
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const passportConfig = require('./config/passport');
const customTripRoutes = require('./routes/customTripRoutes.js')
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // The frontend's local URL
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
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
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // or 'cross-origin' if served from a different domain
    next();
  },
  express.static("uploads")
);
// Middleware
app.use(session({
  secret: 'omotribestour', // Change this to a secure key
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());


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
app.use("/api/cars", carRoutes)
app.use("/api/custom-trips", customTripRoutes)
app.use(notFound);
app.use(errorHandler);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

