const asyncHandler = require("express-async-handler");
const Tour = require("../models/tourModel.js");
const fs = require('fs/promises');
const path = require('path');


const deleteFile = async (filename) => {
  const filePath = path.join(__dirname, '../uploads', filename);
  await fs.unlink(filePath).catch(err => console.error(`Error deleting file ${filename}:`, err));
};

const registerTour = asyncHandler(async (req, res) => {
  try {
    const { title, description, destination, price, duration, itinerary } =
      req.body;
    const imageUrl = req.files ? req.files.map((file) => file.path) : []; // Get paths to the uploaded images

    const tourExists = await Tour.findOne({ title });

    if (tourExists) {
      res.status(400);
      throw new Error("Tour already exists");
    }

    const tour = await Tour.create({
      title,
      description,
      destination,
      price,
      duration,
      imageUrl,
      itinerary: JSON.parse(itinerary), // Convert JSON string to object
    });

    if (tour) {
      res.status(201).json({
        _id: tour._id,
        title: tour.title,
        description: tour.description,
        destination: tour.destination,
        price: tour.price,
        duration: tour.duration,
        imageUrl: tour.imageUrl,
        itinerary: tour.itinerary,
      });
    } else {
      res.status(400);
      throw new Error("Invalid data");
    }
  } catch (error) {
    console.error("Error registering tour:", error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

// @desc Get all tours
// @route GET /api/tours
// @access Public
const getTours = asyncHandler(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).json(tours);
});

// @desc Get tour by ID
// @route GET /api/tours/:id
// @access Public
const getTourById = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  if (tour) {
    res.status(200).json(tour);
  } else {
    res.status(404);
    throw new Error("Tour not found");
  }
});
// @desc Update a tour
// @route PUT /api/tours/:id
// @access Private
const updateTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  const data = JSON.parse(req.body.data || '{}');
  const { clearExistingImages, imageUrl, ...updateData } = data;

  if (clearExistingImages) {
    // Remove existing images from storage sequentially
    for (const url of tour.imageUrl) {
      const filename = url.split('/').pop();
      await deleteFile(filename);
    }
    tour.imageUrl = [];
  }

  // Process new image uploads
  if (req.files) {
    const newImages = req.files.map(file => file.path);
    tour.imageUrl = [...tour.imageUrl, ...newImages];
  }

  // Update other fields without overwriting imageUrl
  Object.assign(tour, updateData);

  if (data.itinerary) {
    tour.itinerary = typeof data.itinerary === 'string'
      ? JSON.parse(data.itinerary)
      : data.itinerary;
  }

  const updatedTour = await tour.save();
  res.status(200).json(updatedTour);
});


// @desc Delete a tour
// @route DELETE /api/tours/:id
// @access Private
const deleteTour = asyncHandler(async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (tour) {
      res.status(200).json({ message: "Tour removed" });
    } else {
      res.status(404);
      throw new Error("Tour not found");
    }
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = {
  registerTour,
  getTours,
  getTourById,
  updateTour,
  deleteTour,
};


