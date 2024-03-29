const express = require('express');
const mongoose = require('mongoose');
const app = express();
const connectDB = require('../src/DB/connection');
require('dotenv').config();
const port = process.env.PORT ;

connectDB().then(() => {
  app.listen(port, () => console.log('Server running successfully'));
});
