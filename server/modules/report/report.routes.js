const express = require("express");

const router = express.Router();

const reportController = require("./report.controller");

const protect = require("../../middleware/auth.middleware");

router.get(
    "/prospects",
    protect.protect,
    reportController.getProspectReport
);

router.get(
    "/outreach",
    protect.protect,
    reportController.getOutreachReport
);


router.get(

    "/interviews",

    protect.protect,

    reportController.getInterviewReport

);

router.get(

    "/performance",

    protect.protect,

    reportController.getPerformanceReport

);


module.exports = router;