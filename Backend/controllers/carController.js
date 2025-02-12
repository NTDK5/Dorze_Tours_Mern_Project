const asyncHandler = require("express-async-handler");
const Car = require("../models/carModel.js");

// Get all cars
const getCars = asyncHandler(async (req, res) => {
    const cars = await Car.find({});
    res.json(cars);
});

// Get single car
const getCarById = asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id);
    if (car) {
        res.json(car);
    } else {
        res.status(404);
        throw new Error("Car not found");
    }
});

// Create car (admin)
const createCar = asyncHandler(async (req, res) => {
    const {
        name,
        brand,
        model,
        year,
        transmission,
        fuelType,
        seats,
        pricePerDay,
        features,
        description,
        available,
    } = req.body;

    const images = req.files ? req.files.map((file) => file.path) : [];

    const car = await Car.create({
        name,
        brand,
        model,
        year,
        transmission,
        fuelType,
        seats,
        pricePerDay,
        images,
        features: JSON.parse(features),
        description,
        available: available !== undefined ? available : true
    });

    if (car) {
        res.status(201).json(car);
    } else {
        res.status(400);
        throw new Error("Invalid car data");
    }
});

// Delete car
const deleteCar = asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id);
    if (car) {
        await car.remove();
        res.json({ message: 'Car removed' });
    } else {
        res.status(404);
        throw new Error('Car not found');
    }
});

// Update car
const updateCar = asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id);

    if (car) {
        car.name = req.body.name || car.name;
        car.brand = req.body.brand || car.brand;
        car.model = req.body.model || car.model;
        car.year = req.body.year || car.year;
        car.transmission = req.body.transmission || car.transmission;
        car.fuelType = req.body.fuelType || car.fuelType;
        car.seats = req.body.seats || car.seats;
        car.pricePerDay = req.body.pricePerDay || car.pricePerDay;
        car.description = req.body.description || car.description;
        car.available = req.body.available !== undefined ? req.body.available : car.available;

        if (req.files && req.files.length > 0) {
            car.images = req.files.map(file => file.path);
        }

        if (req.body.features) {
            car.features = JSON.parse(req.body.features);
        }

        const updatedCar = await car.save();
        res.json(updatedCar);
    } else {
        res.status(404);
        throw new Error('Car not found');
    }
});

module.exports = {
    getCars,
    getCarById,
    createCar,
    deleteCar,
    updateCar,
}; 