const mongoose = require("mongoose");
const { Schema } = mongoose;

const feedbackSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    semester: {
      type: String,
    },
    selectedOptions: [{
      answer: {
        type: String,
        required: true,
        enum: ["1", "2", "3", "4", "5"],
      }
    }],
    comments: {
      type: String,
    },

  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
/*
{
  "answers": [
    {
      "selectedOption": "Option 1"
    },
    {
      "selectedOption": "Option 2"
    },
    {
      "selectedOption": "Option 3"
    },
    {
      "selectedOption": "Option 4"
    },
    {
      "selectedOption": "Option 5"
    },
    {
      "selectedOption": "Option 1"
    },
    {
      "selectedOption": "Option 2"
    },
    {
      "selectedOption": "Option 3"
    },
    {
      "selectedOption": "Option 4"
    },
    {
      "selectedOption": "Option 5"
    },
    {
      "selectedOption": "Option 1"
    },
    {
      "selectedOption": "Option 2"
    },
    {
      "selectedOption": "Option 3"
    },
    {
      "selectedOption": "Option 4"
    },
    {
      "selectedOption": "Option 5"
    },
    {
      "selectedOption": "Option 1"
    },
    {
      "selectedOption": "Option 2"
    },
    {
      "selectedOption": "Option 3"
    },
    {
      "selectedOption": "Option 4"
    },
    {
      "selectedOption": "Option 5"
    },
    {
      "selectedOption": "Option 1"
    },
    {
      "selectedOption": "Option 2"
    },
    {
      "selectedOption": "Option 3"
    },
    {
      "selectedOption": "Option 4"
    },
    {
      "selectedOption": "Option 5"
    },
    {
      "selectedOption": "Option 1"
    },
    {
      "selectedOption": "Option 2"
    },
    {
      "selectedOption": "Option 3"
    },
    {
      "selectedOption": "Option 4"
    },
    {
      "selectedOption": "Option 5"
    },
    {
      "selectedOption": "Option 1"
    },
    {
      "selectedOption": "Option 2"
    },
    {
      "selectedOption": "Option 3"
    },
    {
      "selectedOption": "Option 4"
    },
    {
      "selectedOption": "Option 5"
    },
    {
      "selectedOption": "Option 1"
    },
    {
      "selectedOption": "Option 2"
    },
    {
      "selectedOption": "Option 3"
    },
    {
      "selectedOption": "Option 4"
    },
    {
      "selectedOption": "Option 5"
    },
    {
      "selectedOption": "Option 1"
    },
    {
      "selectedOption": "Option 2"
    },
    {
      "selectedOption": "Option 3"
    },
    {
      "selectedOption": "Option 4"
    },
    {
      "selectedOption": "Option 5"
    },
    {
      "selectedOption": "Option 1"
    },
    {
      "selectedOption": "Option 2"
    },
    {
      "selectedOption": "Option 3"
    },
    {
      "selectedOption": "Option 4"
    },
    {
      "selectedOption": "Option 5"
    },
    {
      "selectedOption": "Option 1"
    },
    {
      "selectedOption": "Option 2"
    },
    {
      "selectedOption": "Option 3"
    },
    {
      "selectedOption": "Option 4"
    },
    {
      "selectedOption": "Option 5"
    },
    {
      "selectedOption": "Option 1"
    },
    {
      "selectedOption": "Option 2"
    },
    {
      "selectedOption": "Option 3"
    },
    {
      "selectedOption": "Option 4"
    },
    {
      "selectedOption": "Option 5"
    }
  ]
} */