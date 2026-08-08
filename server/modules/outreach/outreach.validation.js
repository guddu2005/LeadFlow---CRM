const Joi = require("joi");

const createOutreachValidation = Joi.object({
    prospect: Joi.string()
        .allow("", null)
        .optional(),

    template: Joi.string()
        .allow("", null)
        .optional(),

    channel: Joi.string()
        .valid(
            "LinkedIn",
            "Email",
            "Phone"
        )
        .optional(),

    sequenceType: Joi.string()
        .allow("", null)
        .optional(),

    sequenceStep: Joi.number()
        .optional(),

    status: Joi.string()
        .allow("", null)
        .optional(),

    subject: Joi.string()
        .allow("", null)
        .optional(),

    message: Joi.string()
        .allow("", null)
        .optional(),

    scheduledAt: Joi.date()
        .optional(),

    followUpNumber: Joi.number()
        .min(0)
        .max(2)
        .optional(),

    assignedTo: Joi.string()
        .allow("", null)
        .optional(),

    notes: Joi.string()
        .allow("", null)
        .optional()
});

const updateOutreachValidation = Joi.object({

    channel: Joi.string()
        .valid(
            "LinkedIn",
            "Email",
            "Phone"
        )
        .optional(),

    sequenceType: Joi.string()
        .valid(
            "Initial",
            "Follow Up 1",
            "Follow Up 2"
        )
        .optional(),

    scheduledAt: Joi.date()
        .optional(),

    followUpNumber: Joi.number()
        .min(0)
        .max(2)
        .optional(),

    outcome: Joi.string()
        .valid(
            "Interested",
            "Not Interested",
            "Call Later",
            "No Response",
            "Meeting Booked",
            "Other"
        )
        .optional(),

    assignedTo: Joi.string()
        .optional(),

    notes: Joi.string()
        .allow("")
        .optional()

}).min(1);

const updateOutreachStatusValidation = Joi.object({

    status: Joi.string()
        .valid(
            "Draft",
            "Scheduled",
            "Sent",
            "Delivered",
            "Opened",
            "Replied",
            "Booked",
            "Failed",
            "Cancelled"
        )
        .required()

});

module.exports = {

    createOutreachValidation,

    updateOutreachValidation,

    updateOutreachStatusValidation

};