const express = require("express");

const router = express.Router();

const dashboardController = require("./dashboard.controller");

const protect = require("../../middleware/auth.middleware");

// Overview
router.get(
    "/overview",
    protect.protect,
    dashboardController.getOverview
);

// Funnel
router.get(
    "/funnel",
    protect.protect,
    dashboardController.getFunnel
);

// Outreach Analytics
router.get(
    "/outreach",
    protect.protect,
    dashboardController.getOutreachAnalytics
);

// Interview Analytics
router.get(
    "/interviews",
    protect.protect,
    dashboardController.getInterviewAnalytics
);

// Recent Activities
router.get(
    "/recent-activities",
    protect.protect,
    dashboardController.getRecentActivities
);

// Monthly Growth
router.get(
    "/monthly-growth",
    protect.protect,
    dashboardController.getMonthlyGrowth
);

module.exports = router;