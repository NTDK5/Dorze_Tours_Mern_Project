const express = require("express");
const { admin, protect } = require("../middleware/authMiddleware.js");
const multer = require("multer");
const path = require("path");
const {
  registerTour,
  getTours,
  getTourById,
  updateTour,
  deleteTour,
} = require("../controllers/tourController.js");

const router = express.Router();
// Configure multer for multiple file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/", protect, admin, upload.array("image"), registerTour);

router.get("/", getTours);
router
  .route("/:id")
  .get(getTourById)
  .put(protect, admin, upload.array("image"), updateTour)
  .delete(protect, admin, deleteTour);

module.exports = router;
