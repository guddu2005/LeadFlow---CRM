const Joi = require("joi");

exports.testEmailSchema = Joi.object({

    email: Joi.string()
        .email()
        .required()

});

exports.customEmailSchema = Joi.object({

    to: Joi.string()
        .email()
        .required(),

    subject: Joi.string()
        .trim()
        .required(),

    html: Joi.string()
        .required()

});