const express = require("express");
const router = express.Router();

const outreachController = require("./outreach.controller");

const {
    createOutreachValidation,
    updateOutreachValidation,
    updateOutreachStatusValidation
} = require("./outreach.validation");

const validate = require("../../middleware/validate");

const { protect } = require("../../middleware/auth.middleware");

router.post(
    "/",
    protect,
    validate(createOutreachValidation),
    outreachController.createOutreach
);

router.get(
    "/",
    protect,
    outreachController.getOutreachs
);

router.get(
    "/stats",
    protect,
    outreachController.getOutreachStats
);

router.get(
    "/prospect/:prospectId",
    protect,
    outreachController.getProspectTimeline
);

router.patch(
    "/:id",
    protect,
    validate(updateOutreachValidation),
    outreachController.updateOutreach
);

router.patch(
    "/:id/status",
    protect,
    validate(updateOutreachStatusValidation),
    outreachController.updateOutreachStatus
);

router.delete(
    "/:id",
    protect,
    outreachController.deleteOutreach
);

module.exports = router;