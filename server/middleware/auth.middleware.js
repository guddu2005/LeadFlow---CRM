const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        throw new ApiError(401, "Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
        throw new ApiError(401, "Not authorized, user not found");
    }
    next();
});


const authorize = (...roles) => {
    const allowedRoles = roles.map((r) => r.toLowerCase());
    return (req, res, next) => {
        const userRole = (req.user?.role || "").toLowerCase();
        if (!allowedRoles.includes(userRole)) {
            return next(new ApiError(403, `User role (${req.user?.role}) is not authorized to access this route`));
        }
        next();
    };
};

module.exports = { protect, authorize };