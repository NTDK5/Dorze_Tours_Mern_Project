const asyncHandler = require('express-async-handler');
const CustomTrip = require('../models/customTripModel.js');

// @desc    Create custom trip request
// @route   POST /api/custom-trips
// @access  Private
const createCustomTrip = asyncHandler(async (req, res) => {
    const { destinations, travelers, startDate, endDate, budget, notes } = req.body;

    const customTrip = await CustomTrip.create({
        user: req.user._id,
        destinations,
        travelers,
        startDate,
        endDate,
        budget,
        notes,
        status: 'pending'
    });

    res.status(201).json(customTrip);
});

const getAllCustomTrips = asyncHandler(async (req, res) => {
    const trips = await CustomTrip.find({})
        .populate('user', 'first_name last_name email')
        .sort({ createdAt: -1 });
    res.json(trips);
});

module.exports = { createCustomTrip, getAllCustomTrips }; 