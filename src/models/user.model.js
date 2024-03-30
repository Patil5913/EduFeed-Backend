import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    prn: {
      type: Number,
      required: true,
      unique: true,
    },
    branch: {
      type: String,
      required: true,
    },
    currentsem: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "student",
      enum: ["student", "mentor", "authority", "admin"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (attempt, next) {
  try {
    return await bcrypt.compare(attempt, this.password);
  } catch (err) {
    return next(err);
  }
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ 
    id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
    currentsem: this.currentsem,
    branch: this.branch,
  }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME});
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ 
    id: this._id,
  }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME});
}

export const User = mongoose.model("User", userSchema);
