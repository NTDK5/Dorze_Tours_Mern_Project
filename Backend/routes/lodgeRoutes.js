const express = require("express");
const { admin, protect } = require("../middleware/authMiddleware.js");
const multer = require("multer");
const path = require("path");
const {
  createLodge,
  getAllLodges,
  getLodgeById,
  updateLodge,
  deleteLodge,
} = require("../controllers/lodgeController.js");

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

router.post("/", protect, admin, upload.array("image"), createLodge);
router.get("/", getAllLodges);
router.get("/:id", getLodgeById);
router.put("/:id", protect, admin, updateLodge);
router.delete("/:id", protect, admin, deleteLodge);

module.exports = router;
