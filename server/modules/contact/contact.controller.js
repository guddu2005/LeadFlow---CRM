const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const contactService = require("./contact.service");



// Create Contact

exports.createContact = asyncHandler(async(req,res)=>{


    const contact =
    await contactService.createContact(

        req.params.companyId,

        req.body,

        req.user._id

    );


    res.status(201).json(

        new ApiResponse(
            201,
            "Contact created successfully",
            contact
        )

    );

});




// Get Company Contacts

exports.getCompanyContacts = asyncHandler(async(req,res)=>{


    const contacts =
    await contactService.getCompanyContacts(

        req.params.companyId,

        req.query

    );


    res.status(200).json(

        new ApiResponse(
            200,
            "Contacts fetched successfully",
            contacts
        )

    );

});




// Get Contact

exports.getContactById = asyncHandler(async(req,res)=>{


    const contact =
    await contactService.getContactById(
        req.params.id
    );


    res.status(200).json(

        new ApiResponse(
            200,
            "Contact fetched successfully",
            contact
        )

    );

});




// Update

exports.updateContact = asyncHandler(async(req,res)=>{


    const contact =
    await contactService.updateContact(

        req.params.id,

        req.body,

        req.user._id

    );


    res.status(200).json(

        new ApiResponse(
            200,
            "Contact updated successfully",
            contact
        )

    );

});




// Delete

exports.deleteContact = asyncHandler(async(req,res)=>{


    const contact =
    await contactService.deleteContact(
        req.params.id
    );


    res.status(200).json(

        new ApiResponse(
            200,
            "Contact deleted successfully",
            contact
        )

    );

});



// Restore

exports.restoreContact = asyncHandler(async(req,res)=>{


    const contact =
    await contactService.restoreContact(
        req.params.id
    );


    res.status(200).json(

        new ApiResponse(
            200,
            "Contact restored successfully",
            contact
        )

    );

});

// Get All Contacts
exports.getAllContacts = asyncHandler(async(req,res)=>{
    const result = await contactService.getAllContacts(req.query);
    res.status(200).json(
        new ApiResponse(
            200,
            "Contacts fetched successfully",
            result
        )
    );
});
