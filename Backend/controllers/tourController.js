const asyncHandler = require("express-async-handler");
const Tour = require("../models/tourModel.js");
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
  const { title, description, destination, price, duration, itinerary, imageUrl } = req.body;
  const newImages = req.files?.map(file => file.path) || [];

  const tour = await Tour.findById(req.params.id);

  if (tour) {
    tour.title = title || tour.title;
    tour.description = description || tour.description;
    tour.destination = destination || tour.destination;
    tour.price = price || tour.price;
    tour.duration = duration || tour.duration;

    // Merge existing images with new ones
    tour.imageUrl = [
      ...newImages,
      ...(typeof imageUrl === 'string' && imageUrl.trim() !== '' ? JSON.parse(imageUrl) : [])
    ];

    if (itinerary) {
      tour.itinerary = typeof itinerary === 'string'
        ? JSON.parse(itinerary)
        : itinerary;
    }

    const updatedTour = await tour.save();
    res.status(200).json(updatedTour);
  } else {
    res.status(404);
    throw new Error("Tour not found");
  }
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
