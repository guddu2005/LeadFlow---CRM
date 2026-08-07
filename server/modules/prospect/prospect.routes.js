const express = require("express");
const router = express.Router();

const prospectController = require("./prospect.controller");
const {
    createProspectValidation,
    updateProspectValidation
} = require("./prospect.validation");

const validate = require("../../middleware/validate");
const { protect } = require("../../middleware/auth.middleware");
const uploadCsv = require("../../middleware/uploadCsv");

// console.log("protect:", protect);
// console.log("validate:", validate);
// console.log("controller:", prospectController.createProspect);

router.post(
    "/",
    protect,
    validate(createProspectValidation),
    prospectController.createProspect
);

router.get(
    "/",
    protect,
    prospectController.getProspects
);

router.get(
    "/:id",
    protect,
    prospectController.getProspectById
);

router.patch(
    "/:id",
    protect,
    validate(updateProspectValidation),
    prospectController.updateProspect
);

router.delete(
    "/:id",
    protect,
    prospectController.deleteProspect
);

router.post(
    "/:id/convert",
    protect,
    prospectController.convertProspect
);
router.post(
    "/import",
    protect,
    uploadCsv.single("file"),
    prospectController.importProspects
);

module.exports = router;