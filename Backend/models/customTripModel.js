const mongoose = require('mongoose');

const customTripSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    destinations: [String],
    travelers: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: String, required: true },
    notes: String,
    status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' },
}, {
    timestamps: true
});

const CustomTrip = mongoose.model('CustomTrip', customTripSchema);

module.exports = CustomTrip; 