const ApiError = require("../utils/ApiError");

const validate = (schema) => {
    return (req, res, next) => {

        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return next(
                new ApiError(
                    400,
                    error.details.map(item => item.message).join(", ")
                )
            );
        }

        next();
    };
};

module.exports = validate;