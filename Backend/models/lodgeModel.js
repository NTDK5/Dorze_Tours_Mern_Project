const mongoose = require("mongoose");

const LodgeSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Dorze Lodge",
  },
  location: {
    type: String,
    default: "Dorze, Ethiopia",
  },
  roomTypes: [
    {
      type: {
        type: String, // e.g., "Single Room", "Double Room", "Family Room"
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      amenities: {
        type: [String], // e.g., ["Wi-Fi", "Breakfast", "Mountain View"]
        required: true,
      },
      availableRooms: {
        type: Number,
        required: true,
      },
    },
  ],
  description: {
    type: String,
  },
  images: [String], // Array of image URLs
  contactInfo: {
    phone: String,
    email: String,
  },
});

const Lodge = mongoose.model("Lodge", LodgeSchema);

module.exports = Lodge;
