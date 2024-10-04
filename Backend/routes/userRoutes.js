const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware.js");
const {
  authUser,
  registerUser,
  verifyEmail,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController.js");

const router = express.Router();

router.post("/", registerUser);
router.get("/verify-email", verifyEmail);
router.get("/", protect, admin, getAllUsers);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.delete("/:id", protect, admin, deleteUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
