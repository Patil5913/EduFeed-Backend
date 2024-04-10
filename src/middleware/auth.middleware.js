const jwt = require("jsonwebtoken");
const userData = require("../models/user.model");

const auth = async (req, res, next) => {
  try {

    const token = req.cookies.accessToken; // Corrected token retrieval
    
    if (!token) {
      throw new Error('Token not found');
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("Decoded token:", decoded);
    // console.log("Decoded token ID:", decoded.id);

    const user = await userData.findOne({ _id: decoded.id });
    
    if (!user) {
      throw new Error('User not found');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
