const mongoose = require("mongoose");
const { Schema } = mongoose;

const feedbackQuestionSchema = new Schema(
  {
    email: {
      type: String,
    },
    semester: {
      type: String,
    },
    subjects: [
      {
        type: String,
      },
    ],
    questions: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const FeedbackQuestion = mongoose.model(
  "FeedbackQuestion",
  feedbackQuestionSchema
);

module.exports = FeedbackQuestion;
