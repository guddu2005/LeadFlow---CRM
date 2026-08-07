const express = require("express");

const router = express.Router();

const leadController = require("./lead.controller");

const validate = require("../../middleware/validate");

const {
    createLeadSchema,
    updateLeadSchema,
    assignLeadValidation
} = require("./lead.validation");

const {
    protect,
    authorize
} = require("../../middleware/auth.middleware");

// Create Lead
router.post(
    "/",
    protect,
    authorize("admin", "manager"),
    validate(createLeadSchema),
    leadController.createLead
);

// Get All Leads
router.get(
    "/",
    protect,
    authorize("admin", "manager", "employee"),
    leadController.getLeads
);

// Lead Statistics
router.get(
    "/stats",
    protect,
    authorize("admin", "manager"),
    leadController.getLeadStats
);

// Get Lead By ID
router.get(
    "/:id",
    protect,
    authorize("admin", "manager", "employee"),
    leadController.getLeadById
);

// Update Lead
router.patch(
    "/:id",
    protect,
    authorize("admin", "manager"),
    validate(updateLeadSchema),
    leadController.updateLead
);

// Delete Lead
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    leadController.deleteLead
);

// Restore Lead
router.patch(
    "/:id/restore",
    protect,
    authorize("admin"),
    leadController.restoreLead
);

router.patch(
    "/:id/assign",
    protect,
    validate(assignLeadValidation),
    leadController.assignLead
);

router.post(
    "/:id/convert-company",
    protect,
    authorize("admin", "manager"),
    leadController.convertLeadToCompany
);

module.exports = router;