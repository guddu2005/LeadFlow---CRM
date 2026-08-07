const User = require("../../models/User");
const asyncHandler = require("../../middleware/asyncHandler");
const generateToken = require("../../utils/generateToken");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const crypto = require("crypto");
const transporter = require("../../config/mail");

// @desc    Register a new user
// @route POST /api/auth/register
// @access Public

const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    // validation
    if (!firstName || !lastName || !email || !password || !role) {
        throw new ApiError(400, "Please provide all required fields");
    }
    // checking existing error
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }


    // create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role
    });

    // Send Welcome Email
    try {
        const emailService = require("../email/email.service");
        await emailService.sendWelcomeEmail(user);
    } catch (err) {
        console.error("Welcome email send error:", err);
    }


    const token = generateToken(user._id);
    res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully",
            {
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            }
        )
    );
});


// @desc Login User
// @route POST /api/auth/login
// @access Public

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }


    const token = generateToken(user._id);
    res.status(200).json(
        new ApiResponse(200, { token ,user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        }}, "User logged in successfully")
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, { user: req.user }, "Current user fetched successfully")
    );
});

const adminDashboard = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, { user: req.user }, "Admin dashboard fetched successfully")
    );
});


const logout = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, null, "User logged out successfully")
    );
});

const changePassword  = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both passwords are required");
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
        throw new ApiError(400, "Old password is incorrect");
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json(
        new ApiResponse(
            200,
            "Password changed successfully"
        )
    );

});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();

    // Save hashed token & expiry
    await user.save({ validateBeforeSave: false });

    // Reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Email content
    const message = `
        <h2>Password Reset</h2>

        <p>Click the button below to reset your password.</p>

        <a href="${resetUrl}"
           style="padding:10px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:5px;">
            Reset Password
        </a>

        <p>This link will expire in 15 minutes.</p>
    `;

    try {

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: user.email,

            subject: "Password Reset",

            html: message

        });

        res.status(200).json(
            new ApiResponse(
                200,
                "Password reset email sent successfully"
            )
        );

    } catch (error) {

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        throw new ApiError(500, "Email could not be sent");

    }

});

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json(
        new ApiResponse(200, "Users fetched successfully", users)
    );
});

module.exports = {
    register,
    login,
    getCurrentUser,
    adminDashboard,
    getUsers,
    logout,
    changePassword,
    forgotPassword
};
  