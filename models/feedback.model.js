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
    answers: [
      
      {
        question: {
          type:String,
        },
        selectedOption: {
          type: String,
          enum: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
        },
      },
    ],
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