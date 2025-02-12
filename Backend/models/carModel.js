const mongoose = require("mongoose");

const carSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        transmission: {
            type: String,
            enum: ['Manual', 'Automatic'],
            required: true,
        },
        fuelType: {
            type: String,
            enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
            required: true,
        },
        seats: {
            type: Number,
            required: true,
        },
        pricePerDay: {
            type: Number,
            required: true,
        },
        images: [{
            type: String,
            required: true,
        }],
        features: [{
            type: String,
        }],
        available: {
            type: Boolean,
            default: true,
        },
        description: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Car = mongoose.model("Car", carSchema);
module.exports = Car; 