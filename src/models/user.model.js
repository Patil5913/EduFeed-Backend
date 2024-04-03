const { Schema, mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
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

cron.schedule(
  '0 0 1 4,10 *',
  async () => {
    try {
      const students = await userData.find({ role: "student" });
      console.log("Updating student semester...");
      // console.log(students);
      for (const student of students) {
        const currentSemester = parseInt(student.currentsem);
        const nextSemester = currentSemester + 3;

        if (nextSemester > 8) {
          await userData.deleteOne({ _id: student._id });
          console.log(`User ${student.name} deleted, maximum semester reached`);
        } else {
          student.currentsem = nextSemester;
          await student.save();
          console.log(
            `User ${student.name} semester updated to ${nextSemester}`
          );
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

userSchema.methods.comparePassword = async function (attempt, next) {
  try {
    return await bcrypt.compare(attempt, this.password);
  } catch (err) {
    return next(err);
  }
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
      currentsem: this.currentsem,
      branch: this.branch,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME }
  );
};

const userData = mongoose.model("user", userSchema);

module.exports = userData;
