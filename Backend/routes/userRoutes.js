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
  adminUpdateUserProfile,
} = require("../controllers/userController.js");
const passport = require('passport');
const generateToken = require("../utils/generateToken.js");
const router = express.Router();
const jwt = require('jsonwebtoken');
router.post("/", registerUser);
router.get("/verify-email", verifyEmail);
router.get("/", protect, admin, getAllUsers);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .put(protect, admin, adminUpdateUserProfile)
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// @desc Auth with Google
// @route GET /api/users/auth/google
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// @desc Google auth callback
// @route GET /api/users/auth/google/callback
router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/login', // Redirect to login if authentication fails
}), async (req, res) => {
  // Successful authentication
  const user = req.user; // Get the authenticated user
  // Generate JWT
  const token = jwt.sign(
    {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      verified: user.verified,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expiry
  );
  res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
});


module.exports = router;
