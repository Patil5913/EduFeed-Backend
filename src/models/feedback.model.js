import mongoose from "mongoose";
const { Schema } = mongoose;

const feedbackSchema = new Schema(
  {
    mentorQuestions: [
      {
        type: String,
      },
    ],
    email: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
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

export const Feedback = mongoose.model("Feedback", feedbackSchema);
