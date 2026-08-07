const express = require("express");
const router = express.Router();

const templateController = require("./template.controller");

const {
    createTemplateValidation,
    updateTemplateValidation,
    previewTemplateValidation
} = require("./template.validation");

const validate = require("../../middleware/validate");
const { protect } = require("../../middleware/auth.middleware");

router.post(
    "/",
    protect,
    validate(createTemplateValidation),
    templateController.createTemplate
);

router.get(
    "/",
    protect,
    templateController.getTemplates
);

router.get(
    "/:id",
    protect,
    templateController.getTemplateById
);

router.patch(
    "/:id",
    protect,
    validate(updateTemplateValidation),
    templateController.updateTemplate
);

router.delete(
    "/:id",
    protect,
    templateController.deleteTemplate
);

router.post(
    "/preview",
    protect,
    validate(previewTemplateValidation),
    templateController.previewTemplate
);

module.exports = router;