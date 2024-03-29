const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const connectDB = require('../src/DB/connection');
require('dotenv').config();
const port = process.env.PORT ;

app.use(cors({
  origin:process.env.CLIENT_URL,
  credentials:true
}));

app.use(express.json());
app.use(cookieParser());


connectDB().then(() => {
  app.listen(port || 6969 , () => console.log(`Server running successfully ${port}`));
});
