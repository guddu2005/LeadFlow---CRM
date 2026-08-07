const Joi = require("joi");


// Create Notification Validation

const createNotificationValidation = Joi.object({

    user: Joi.string()
        .required()
        .messages({
            "string.empty": "User is required",
            "any.required": "User is required"
        }),


    type: Joi.string()
        .valid(
            "LEAD_ASSIGNED",
            "INTERVIEW_CREATED",
            "INTERVIEW_REMINDER",
            "FOLLOW_UP_REMINDER",
            "COMPANY_VERIFIED",
            "EMAIL_SENT",
            "STATUS_CHANGED"
        )
        .required()
        .messages({
            "any.only": "Invalid notification type",
            "any.required": "Notification type is required"
        }),



    title: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Title is required",
            "any.required": "Title is required"
        }),



    message: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Message is required",
            "any.required": "Message is required"
        }),



    referenceId: Joi.string()
        .optional()
        .allow(null),



    referenceModel: Joi.string()
        .valid(
            "Lead",
            "Company",
            "Contact",
            "Interview",
            "Activity"
        )
        .optional()
        .allow(null)

});




// ID Validation

const notificationIdValidation = Joi.object({

    id: Joi.string()
        .required()
        .messages({
            "any.required": "Notification ID is required"
        })

});



module.exports = {

    createNotificationValidation,

    notificationIdValidation

};