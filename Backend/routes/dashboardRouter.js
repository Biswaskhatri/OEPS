// External Module
const express = require("express");
const dashboardRouter = express.Router();

// Local Module
const dashboardController = require("../controllers/dashboardController");


dashboardRouter.get('/latest', dashboardController.getLatestUserResult);

dashboardRouter.get('/debug-latest-result', dashboardController.debugLatestResult);

dashboardRouter.get('/dashboard-summary', dashboardController.getDashboardSummary);

//dashboardRouter.get('/top-performers', dashboardController.getTopPerformers);


module.exports = dashboardRouter;