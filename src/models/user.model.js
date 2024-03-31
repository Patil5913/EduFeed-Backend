const {Schema, mongoose}  = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    prn: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    currentsem: {
      type: String,
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

const userData = mongoose.model("user", userSchema);

module.exports = userData;