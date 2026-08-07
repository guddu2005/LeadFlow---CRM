const express = require("express");

const router = express.Router();

const interviewController = require("./interview.controller");

const validate = require("../../middleware/validate");

const {
    protect,
    authorize
} = require("../../middleware/auth.middleware");

const {
    scheduleInterviewSchema,
    updateInterviewSchema,
    completeInterviewSchema
} = require("./interview.validation");

router.post(
    "/",
    protect,
    authorize("admin", "manager", "researcher"),
    validate(scheduleInterviewSchema),
    interviewController.scheduleInterview
);

router.get(
    "/",
    protect,
    interviewController.getInterviews
);

router.get(
    "/stats",
    protect,
    interviewController.getInterviewStats
);

router.get(
    "/:id",
    protect,
    interviewController.getInterviewById
);

router.patch(
    "/:id",
    protect,
    authorize("admin", "manager", "researcher"),
    validate(updateInterviewSchema),
    interviewController.updateInterview
);

router.patch(
    "/:id/cancel",
    protect,
    authorize("admin", "manager", "researcher"),
    interviewController.cancelInterview
);

router.patch(
    "/:id/complete",
    protect,
    authorize("admin", "manager", "researcher"),
    validate(completeInterviewSchema),
    interviewController.completeInterview
);

router.delete(
    "/:id",
    protect,
    authorize("admin", "manager"),
    interviewController.deleteInterview
);

router.patch(
    "/:id/restore",
    protect,
    authorize("admin", "manager"),
    interviewController.restoreInterview
);

router.patch(
    "/:id/no-show",
    protect,
    authorize("admin", "manager", "researcher"),
    interviewController.markNoShow
);


module.exports = router;