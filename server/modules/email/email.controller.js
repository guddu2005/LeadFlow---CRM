const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const emailService = require("./email.service");

exports.sendTestEmail = asyncHandler(async (req, res) => {

    await emailService.sendTestEmail(req.body.email);

    res.status(200).json(
        new ApiResponse(
            200,
            "Test email sent successfully"
        )
    );

});

exports.sendCustomEmail = asyncHandler(async (req, res) => {

    const { to, subject, html } = req.body;

    await emailService.sendEmail({
        to,
        subject,
        html
    });

    res.status(200).json(
        new ApiResponse(
            200,
            "Email sent successfully"
        )
    );

});