// const mongoose  = require("mongoose");
const userData = require("../models/user.model");
const feedbackAnswer = require("../models/feedback.model");
const feedbackQuestion = require("../models/feedbackquestion.model");
const jwt = require("jsonwebtoken");
const { all } = require("../routers/router");

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
      const role = decodedToken.role;
      if ((!email || !semester) && role === "mentor") {
        return res.status(400).json({ error: "Invalid user or semester" });
      }

      if (
        !subjects ||
        !questions ||
        !(
          subjects.length === 5 ||
          subjects.length === 6 ||
          subjects.length === 7
        ) ||
        questions.length !== 10
      ) {
        return res.status(400).json({
          error:
            "Invalid number of subjects or questions entered, subjects must be 5,6 or 7 and questions must be 10",
        });
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
  submitFeedback: async (req, res) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        return res.status(400).json({ error: "Cookie not found" });
      }

      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );

      const { answers, comments } = req.body;

      const email = decodedToken.email;
      const name = decodedToken.name;
      const semester = decodedToken.currentsem;
      const role = decodedToken.role;
      const user = await feedbackAnswer.findOne({ email });
      if (user) {
        return res.status(400).json({ error: "Feedback already submitted" });
      }
      if (!email && !semester && role !== "student") {
        return res.status(400).json({ error: "Invalid user or semester" });
      }

      // Fetch feedback questions for the current semester
      const feedbackQuestions = await feedbackQuestion.findOne({ semester });

      if (!feedbackQuestions) {
        return res
          .status(404)
          .json({ error: "Feedback questions not found for this semester" });
      }

      const subjects = feedbackQuestions.subjects;
      const options = answers.map((item) => item.selectedOption);
      const allAnswers = [];
      for (const subject of subjects) {
        const questions = feedbackQuestions.questions.toString().split(",");
        for (const question of questions) {
          allAnswers.push({
            question: question,
            selectedOption: options.shift(),
          });
        }
      }

      console.log(allAnswers);
      // Save feedback answers
      const answer = new feedbackAnswer({
        name,
        email,
        semester,
        answers: allAnswers,
        comments,
      });

      await answer.save();

      res
        .status(200)
        .json({ message: "Feedback answers submitted successfully" });
    } catch (error) {
      // Return error response
      res.status(500).json({ message: error.message });
    }
  },
  getQuestions: async (req, res) => {
    try {
      const questions = await feedbackQuestion.find({});
      res.status(200).json({
        questions: questions.map((question) => {
          return {
            semester: question.semester,
            subjects: question.subjects,
            questions: question.questions,
          };
        }),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getFeedback: async (req, res) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        return res.status(400).json({ error: "Cookie not found" });
      }

      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      const email = decodedToken.email;
      const role = decodedToken.role;

      if (role !== "mentor" && role !== "authority") {
        return res.status(400).json({ error: "Unauthorized role" });
      }

      const feedback = await userData.findOne({ email });

      if (!feedback) {
        return res.status(404).json({ error: "Feedback not found" });
      }

      if (role === "mentor") {
        if (decodedToken.currentsem) {
          const feedbackSemester = await feedbackAnswer.find({
            semester: decodedToken.currentsem,
          });
          if (feedbackSemester.length > 0) {
            const selectedOption = feedbackSemester.map((item) =>
              item.answers.map((item) => item.selectedOption)
            );
            return res.status(200).json({ selectedOption: selectedOption });
          } else {
            return res.status(400).json({
              message: "Feedback for the assigned semester does not exist",
            });
          }
        } else {
          return res
            .status(400)
            .json({ error: "Mentor not assigned to any semester" });
        }
      }

      if (role === "authority") {
        const allFeedback = await feedbackAnswer.find({});
        const anonymousFeedback = allFeedback.map((item) => ({
          semester: item.semester,
          feedback: "Anonymous",
        }));
        return res.status(200).json({ feedback: anonymousFeedback });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getStudentDetail: async (req, res) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        return res.status(400).json({ error: "Cookie not found" });
      }

      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      const email = decodedToken.email;
      const role = decodedToken.role;

      // Check if the role is mentor
      if (role !== "mentor") {
        return res.status(400).json({ error: "Unauthorized role" });
      }

      const feedback = await userData.findOne({ email });

      if (!feedback) {
        return res.status(404).json({ error: "Feedback not found" });
      }

      if (decodedToken.currentsem) {
        const feedbackSemester = await feedbackAnswer.find({
          semester: decodedToken.currentsem,
        });
        if (feedbackSemester.length > 0) {
          const studentFeedback = feedbackSemester.map((item) => ({
            email: item.email, 
            name: item.name,
          }));
          return res.status(200).json({ studentFeedback: studentFeedback });
        } else {
          return res
            .status(400)
            .json({
              message: "Feedback for the assigned semester does not exist",
            });
        }
      } else {
        // If the mentor is not assigned to a specific semester, return an error
        return res
          .status(400)
          .json({ error: "Mentor not assigned to any semester" });
      }
    } catch (error) {
      // Return error response
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = feedbackController;
