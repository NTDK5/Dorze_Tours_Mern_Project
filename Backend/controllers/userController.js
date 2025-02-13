const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const generateToken = require("../utils/generateToken.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Email transport setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "natantamiru18@gmail.com",
    pass: "zwwg qidc wajc mijd",
  },
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    // if (!user.verified) {
    //   res
    //     .status(403)
    //     .json({ message: "Email not verified. Please check your inbox." });
    //   return;
    // }

    const token = generateToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      country: user.country,
      token: token,
      role: user.role,
      verified: user.verified,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, country, profile_pic, role } =
    req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("Email already exists");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = await User.create({
      first_name,
      last_name,
      email,
      password,
      country,
      profile_pic,
      role,
      verificationToken,
      verified: false, // Initial verification status
    });

    if (user) {
      const verificationLink = `${process.env.FRONTEND_URL}}/verify-email?token=${verificationToken}`;
      const token = generateToken(user._id);

      // Send verification email
      try {
        await transporter.sendMail({
          to: email,
          subject: "Verify Your Email",
          html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        res.status(500);
        throw new Error("Failed to send verification email");
      }

      res.status(201).json({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        country: user.country,
        profile_pic: user.profile_pic,
        role: user.role,
        verified: user.verified, // Include verification status
        message: "Registration successful! Please verify your email.",
        token: token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500);
    throw new Error("Failed to register user");
  }
});
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });
  console.log(user);
  if (!user) {
    res.status(400);
    throw new Error("Invalid token");
  }

  user.verified = true;
  user.verificationToken = undefined;
  await user.save();
  const Vtoken = generateToken(user._id);

  res.cookie("jwt", Vtoken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600000,
  });
  // Send user data back as part of the response
  res.status(200).json({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    country: user.country,
    profile_pic: user.profile_pic,
    role: user.role,
    verified: user.verified,
    token: Vtoken,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out" });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user?._id,
    first_name: req.user?.first_name,
    last_name: req.user?.last_name,
    email: req.user?.email,
    country: req.user?.country,
    profile_pic: req.user?.profile_pic,
    role: req.user?.role,
  };
  res.status(200).json(user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  // console.log(req.user)

  if (user) {
    user.first_name = req.body.first_name || user.first_name;
    user.last_name = req.body.last_name || user.last_name;
    user.country = req.body.country || user.country;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    user.role = req.body.role || user.role

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      country: updatedUser.country,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const adminUpdateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    user.first_name = req.body.first_name || user.first_name;
    user.last_name = req.body.last_name || user.last_name;
    user.country = req.body.country || user.country;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    user.role = req.body.role || user.role

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      country: updatedUser.country,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to retrieve users");
  }
});

// Delete user controller
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (user) {
      res.status(200).json({ message: "User removed" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error deleting User:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = {
  authUser,
  registerUser,
  verifyEmail,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  adminUpdateUserProfile
};
