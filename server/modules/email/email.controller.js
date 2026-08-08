const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const emailService = require("./email.service");

exports.sendTestEmail = asyncHandler(async (req, res) => {
    const targetEmail = req.body?.email || req.query?.email || "gudducse2005@gmail.com";
    const info = await emailService.sendTestEmail(targetEmail);

    res.status(200).json(
        new ApiResponse(
            200,
            `Test email sent successfully to ${targetEmail}`,
            { messageId: info?.messageId }
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