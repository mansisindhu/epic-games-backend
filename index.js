const express = require("express");
const app = express();

require("dotenv").config();

app.use(express.json());

module.exports = app;
