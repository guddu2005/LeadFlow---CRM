const router = require("express").Router();


const {
    createContact,
    getCompanyContacts,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
    restoreContact
}=require("./contact.controller");


const { protect,authorize } = require("../../middleware/auth.middleware");

// Get all contacts
router.get(
    "/",
    protect,
    getAllContacts
);




// Create contact

router.post(
    "/companies/:companyId",
    protect,
    authorize("admin","manager"),
    createContact
);



// Company contacts

router.get(
    "/companies/:companyId",
    protect,
    getCompanyContacts
);



// Single contact

router.get(
    "/:id",
    protect,
    getContactById
);



// Update

router.patch(
    "/:id",
    protect,
    authorize("admin","manager"),
    updateContact
);



// Delete

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteContact
);



// Restore

router.patch(
    "/:id/restore",
    protect,
    authorize("admin"),
    restoreContact
);



module.exports = router;