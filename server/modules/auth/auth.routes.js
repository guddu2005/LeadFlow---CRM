const express = require("express");
const { protect, authorize } = require("../../middleware/auth.middleware");

const router = express.Router();

const {
    register,
    login, getCurrentUser, adminDashboard, getUsers, logout, changePassword, forgotPassword
} = require("./auth.controller");

router.post("/register", register);

router.post("/login", login);
router.get("/me", protect, getCurrentUser);
router.get("/users", protect, authorize("admin", "manager"), getUsers);
router.post("/logout", protect, logout);
router.post("/forgot-password", forgotPassword);


router.get(
    "/admin",
    protect,
    authorize("admin"),
    adminDashboard
);
router.patch(
    "/change-password",
    protect,
    changePassword
);

module.exports = router;