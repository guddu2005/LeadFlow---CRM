const express = require("express");

const router = express.Router();

const {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    restoreCompany,
    getCompanyStats,
    uploadCompanyLogo
} = require("./company.controller");

const {
    protect,
    authorize
} = require("../../middleware/auth.middleware");

const validate = require("../../middleware/validate");

const {
    createCompanySchema,
    updateCompanySchema
} = require("./company.validation");

const upload = require("../../middleware/upload");


// Create Company
router.post(
    "/",
    protect,
    authorize("admin", "manager"),
    validate(createCompanySchema),
    createCompany
);


// Get All Companies
router.get(
    "/",
    protect,
    getCompanies
);


// Company Statistics
router.get(
    "/stats/overview",
    protect,
    authorize("admin", "manager"),
    getCompanyStats
);


// Get Single Company
router.get(
    "/:id",
    protect,
    getCompanyById
);


// Update Company
router.put(
    "/:id",
    protect,
    authorize("admin", "manager"),
    validate(updateCompanySchema),
    updateCompany
);


// Delete Company (Soft Delete)
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteCompany
);


// Restore Deleted Company
router.patch(
    "/:id/restore",
    protect,
    authorize("admin"),
    restoreCompany
);


// Upload Company Logo
router.patch(
    "/:id/logo",
    protect,
    authorize("admin", "manager"),
    upload.single("logo"),
    uploadCompanyLogo
);


module.exports = router;