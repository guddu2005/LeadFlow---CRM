const express = require("express");

const router = express.Router();

const activityController = require("./activity.controller");

const validate = require("../../middleware/validate");

const {
    createActivitySchema,
    updateActivitySchema
} = require("./activity.validation");

const {
    protect,
    authorize
} = require("../../middleware/auth.middleware");

// Create Activity
router.post(
    "/",
    protect,
    authorize("admin", "manager"),
    validate(createActivitySchema),
    activityController.createActivity
);

// Get All Activities
router.get(
    "/",
    protect,
    authorize("admin", "manager", "employee"),
    activityController.getActivities
);

// Activity Statistics
router.get(
    "/stats",
    protect,
    authorize("admin", "manager"),
    activityController.getActivityStats
);

// Get Activities By Lead
router.get(
    "/lead/:leadId",
    protect,
    authorize("admin", "manager", "employee"),
    activityController.getActivitiesByLead
);

// Get Activity By ID
router.get(
    "/:id",
    protect,
    authorize("admin", "manager", "employee"),
    activityController.getActivityById
);

// Update Activity
router.patch(
    "/:id",
    protect,
    authorize("admin", "manager"),
    validate(updateActivitySchema),
    activityController.updateActivity
);

// Delete Activity
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    activityController.deleteActivity
);

// Restore Activity
router.patch(
    "/:id/restore",
    protect,
    authorize("admin"),
    activityController.restoreActivity
);

module.exports = router;