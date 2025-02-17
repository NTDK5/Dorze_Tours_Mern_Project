const express = require('express');
const { protect } = require("../middleware/authMiddleware.js");

const { createCustomTrip, getAllCustomTrips } = require('../controllers/customTripController.js');

const router = express.Router();

router.post('/', protect, createCustomTrip);
router.get('/', protect, getAllCustomTrips);

module.exports = router; 