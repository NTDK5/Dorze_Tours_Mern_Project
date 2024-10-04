const asyncHandler = require("express-async-handler");
const Lodge = require("../models/lodgeModel.js");

// @desc Create a new lodge
// @route POST /api/lodges
// @access Private/Admin
const createLodge = asyncHandler(async (req, res) => {
  const {
    name,
    location,
    price,
    amenities,
    description,
    contactInfo,
    imageUrls,
    roomTypes,
  } = req.body;
  const images = req.files
    ? req.files.map((file) => file.path)
    : imageUrls || []; // Get paths to the uploaded images

  const lodge = new Lodge({
    name,
    location,
    price,
    amenities,
    description,
    images,
    contactInfo,
    roomTypes,
  });

  const createdLodge = await lodge.save();
  res.status(201).json(createdLodge);
});

// @desc Get all lodges
// @route GET /api/lodges
// @access Public
const getAllLodges = asyncHandler(async (req, res) => {
  const lodges = await Lodge.find();
  res.status(200).json(lodges);
});

// @desc Get a lodge by ID
// @route GET /api/lodges/:id
// @access Public
const getLodgeById = asyncHandler(async (req, res) => {
  const lodge = await Lodge.findById(req.params.id);

  if (lodge) {
    res.status(200).json(lodge);
  } else {
    res.status(404);
    throw new Error("Lodge not found");
  }
});

// @desc Update a lodge
// @route PUT /api/lodges/:id
// @access Private/Admin
const updateLodge = asyncHandler(async (req, res) => {
  const { name, location, price, amenities, description } = req.body;

  const lodge = await Lodge.findById(req.params.id);

  if (lodge) {
    lodge.name = name || lodge.name;
    lodge.location = location || lodge.location;
    lodge.price = price || lodge.price;
    lodge.amenities = amenities || lodge.amenities;
    lodge.description = description || lodge.description;

    const updatedLodge = await lodge.save();
    res.status(200).json(updatedLodge);
  } else {
    res.status(404);
    throw new Error("Lodge not found");
  }
});

// @desc Delete a lodge
// @route DELETE /api/lodges/:id
// @access Private/Admin
const deleteLodge = asyncHandler(async (req, res) => {
  try {
    console.log(req.params.id);
    const lodge = await Lodge.findByIdAndDelete(req.params.id);
    if (lodge) {
      res.status(200).json({ message: "Lodge removed" });
    } else {
      res.status(404);
      throw new Error("Lodge not found");
    }
  } catch (error) {
    console.error("Error deleting lodge:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = {
  createLodge,
  getAllLodges,
  getLodgeById,
  updateLodge,
  deleteLodge,
};
