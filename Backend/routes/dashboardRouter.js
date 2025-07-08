// External Module
const express = require("express");
const dashboardRouter = express.Router();

// Local Module
const dashboardController = require("../controllers/dashboardController");

dashboardRouter.get("/login", dashboardController.getDashboard);


module.exports = dashboardRouter;