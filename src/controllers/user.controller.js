const { get } = require("mongoose");
const userData = require("../models/user.model");
const { options } = require("../routers/router");
const upload = require("../middleware/multer.middleware");
const csvParser = require("csv-parser");
const fs = require("fs");
const bcrypt = require("bcrypt");
const registerUser = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userData.find({});
      res.json({
        users: users,
        message: "User Fetched Successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  register: async (req, res) => {
    try {
      const { name, email, prn, password, branch, currentsem, role } = req.body;
      if (
        name === undefined ||
        name === "" ||
        email === undefined ||
        email === "" ||
        prn === undefined ||
        prn === "" ||
        password === undefined ||
        password === "" ||
        branch === undefined ||
        branch === "" ||
        currentsem === undefined ||
        currentsem === "" ||
        role === undefined ||
        role === ""
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = new userData({
        name,
        email,
        prn,
        password,
        branch,
        currentsem,
        role,
      });

      const existingUser = await userData.findOne({ email: email });
      if (existingUser) {
        return res.status(208).json({
          message: "User already exists",
        });
      }

      const newUser = await user.save();

      res.status(201).json({
        user: newUser,
        message: "User Added Successfully",
      });
    } catch (error) {
      console.error("Error occurred during user registration:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  uploadCSV: async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const users = [];
    let anyUserCreated = false; // Flag to track if any user was created

    try {
      for (const row of req.file.buffer.toString().split("\n")) {
        const [name, email, password, prn, branch, currentsem, role] =
          row.split(",");

        const existingUser = await userData.findOne({ email });
        if (existingUser) {
          console.log(`User with email ${email} already exists`);
          continue; // Skip this entry
        }

        const newUser = new userData({
          name,
          email,
          password,
          prn,
          branch,
          currentsem,
          role,
        });

        await newUser.save();
        console.log(`User with email ${email} created successfully`);
        anyUserCreated = true; // Set the flag to true
      }

      if (anyUserCreated) {
        return res.status(201).json({ message: "Users created successfully" });
      } else {
        return res.status(208).json({ message: "All users already exist" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (
        email === undefined ||
        email === "" ||
        password === undefined ||
        password === ""
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = await userData.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid Password",
        });
      }

      const { accessToken, refreshToken } =
        await registerUser.generateAccessAndRefreshToken(user._id);

      const options = {
        httpOnly: true,
        // secure: true,
        // for testing purpose comment it down
      };

      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          message: "User logged in successfully",
        });
    } catch (error) {
      console.error("Error occurred during user login:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  generateAccessAndRefreshToken: async (userId) => {
    try {
      const user = await userData.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Error occurred during token generation:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  logoutUser: async (req, res) => {
    try {
      await userData.findByIdAndUpdate(req.user._id, { refreshToken: "" });

      const options = {
        httpOnly: true,
        // secure: true,
      };
      res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
          message: "User logged out successfully",
        });
    } catch (error) {
      console.error("Error occurred during user logout:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  forgotPassword: async (req, res) => {
    const { prn, email, newpassword } = req.body;
    if (
      prn === undefined ||
      prn === "" ||
      email === undefined ||
      email === ""
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const user = await userData.findOne({ prn: prn, email: email });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      user.password = newpassword;
      await user.save({ validateBeforeSave: false });
      res.status(200).json({
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Error occurred during forgot password:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      const user = await userData.findById(req.user._id);
      res.status(200).json({
        user: user,
        message: "User fetched successfully",
      });
    } catch (error) {
      console.error("Error occurred during fetching user:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

module.exports = registerUser;
