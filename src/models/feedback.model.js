const mongoose = require("mongoose");
const { Schema } = mongoose;

const feedbackSchema = new Schema(
  {
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