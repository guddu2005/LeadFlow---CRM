const Joi = require("joi");

const scheduleInterviewSchema = Joi.object({

    lead: Joi.string()
        .required(),

    scheduledAt: Joi.date()
        .required(),

    duration: Joi.number()
        .integer()
        .min(15)
        .max(180)
        .default(30),

    timezone: Joi.string()
        .default("Europe/London"),

    meetingLink: Joi.string()
        .uri()
        .optional(),

    notes: Joi.string()
        .allow("")
        .default("")
});

const updateInterviewSchema = Joi.object({

    scheduledAt: Joi.date(),

    duration: Joi.number()
        .integer()
        .min(15)
        .max(180),

    timezone: Joi.string(),

    meetingLink: Joi.string()
        .uri(),

    status: Joi.string()
        .valid(
            "Scheduled",
            "Rescheduled",
            "Completed",
            "Cancelled",
            "No Show"
        ),

    notes: Joi.string()
        .allow(""),

    feedback: Joi.string()
        .allow("")
});

const completeInterviewSchema = Joi.object({

    feedback: Joi.string()
        .allow("")
        .default("")

});

module.exports = {
    scheduleInterviewSchema,
    updateInterviewSchema,
    completeInterviewSchema
};