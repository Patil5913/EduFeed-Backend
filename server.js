const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const connectDB = require('./DB/connection');
require('dotenv').config();
const port = process.env.PORT ;
const router = require('./routers/router');
const { parse } = require('dotenv');
const { json } = require('express');

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })  );
app.use("/api",router);

connectDB().then(() => {
  app.listen(port || 6969 , () => console.log(`Server running successfully ${port}`));
});
