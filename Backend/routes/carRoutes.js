const express = require("express");
const { admin, protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const {
    getCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} = require("../controllers/carController.js");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.route("/").get(getCars).post(protect, admin, upload.array("images"), createCar);
router.route("/:id").get(getCarById);
router.route("/:id").put(protect, admin, upload.array("images"), updateCar);
router.route("/:id").delete(protect, admin, deleteCar);

module.exports = router; 