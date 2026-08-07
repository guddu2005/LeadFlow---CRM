const express = require("express");

const router = express.Router();

const emailController = require("./email.controller");

const validate = require("../../middleware/validate");

const {
    protect,
    authorize
} = require("../../middleware/auth.middleware");

const {
    testEmailSchema,
    customEmailSchema
} = require("./email.validation");

router.post(
    "/test",
    protect,
    validate(testEmailSchema),
    emailController.sendTestEmail
);

router.post(
    "/send",
    protect,
    validate(customEmailSchema),
    emailController.sendCustomEmail
);

module.exports = router;