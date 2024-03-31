const { get } = require("mongoose");
const userData = require("../models/user.model");

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
        name === undefined || name === '' ||
        email === undefined || email === '' ||
        prn === undefined || prn === '' ||
        password === undefined || password === '' ||
        branch === undefined || branch === '' ||
        currentsem === undefined || currentsem === '' ||
        role === undefined || role === ''
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

      const existingUser = await userData.findOne({ email:email });
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
};

module.exports = registerUser;
