// const mongoose  = require("mongoose");
const userData = require("../models/user.model");
const feedbackData = require("../models/feedback.model");
const feedbackQuestion = require("../models/feedbackquestion.model");
const jwt = require("jsonwebtoken");

const feedbackController = {
  submitQuestion: async (req, res) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        return res.status(400).json({ error: "Cookie not found" });
      }

      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      const { subjects, questions } = req.body;

      const email = decodedToken.email;
      const semester = decodedToken.currentsem;
      if (!email || !semester) {
        return res.status(400).json({ error: "Invalid user or semester" });
      }

      if (!subjects || !questions || !(subjects.length === 5 || subjects.length === 6 || subjects.length === 7) || questions.length !== 10) {
        return res.status(400).json({ error: "Invalid number of subjects or questions entered, subjects must be 5,6 or 7 and questions must be 10" });
    }

      const feedbackQuestionArr = new feedbackQuestion({
        email: email,
        semester: semester,
        subjects: subjects,
        questions: questions,
      });
    //   console.log(feedback);

      await feedbackQuestionArr.save();

      res
        .status(200)
        .json({ message: "Feedback questions submitted successfully" });
    } catch (error) {
      // Return error response
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = feedbackController;
