const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");
const feedbackController = require("../controllers/feedback.controller");

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/getalluser", userController.getAllUsers);
router.get("/getcurruser", auth, userController.getCurrentUser);
router.post("/register", userController.register);
router.post("/login", userController.loginUser);
router.post("/logout", auth ,userController.logoutUser);
router.post("/forgotpassword", userController.forgotPassword);
router.post('/uploadcsv', upload.single('csvFile'), userController.uploadCSV);
router.post('/submitquestion', auth, feedbackController.submitQuestion);

module.exports = router;