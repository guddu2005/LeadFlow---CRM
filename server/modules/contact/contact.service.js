const Contact = require("../../models/Contact");
const Company = require("../../models/Company");
const ApiError = require("../../utils/ApiError");


const createContact = async (companyId, contactData, userId) => {

    const company = await Company.findOne({
        _id: companyId,
        isDeleted:false
    });


    if(!company){
        throw new ApiError(404,"Company not found");
    }


    const contact = await Contact.create({

        ...contactData,

        company: companyId,

        createdBy:userId,

        updatedBy:userId

    });


    // increase contact count
    company.contactsCount += 1;

    await company.save();


    return contact;
};



// Get contacts of company
const getCompanyContacts = async(companyId,query)=>{

    const {
        page=1,
        limit=10,
        search
    } = query;


    const filter={
        company:companyId,
        isDeleted:false
    };


    if(search){

        filter.$or=[

            {
                firstName:{
                    $regex:search,
                    $options:"i"
                }
            },

            {
                lastName:{
                    $regex:search,
                    $options:"i"
                }
            },

            {
                email:{
                    $regex:search,
                    $options:"i"
                }
            },

            {
                jobTitle:{
                    $regex:search,
                    $options:"i"
                }
            }

        ];
    }



    const skip=(page-1)*limit;


    const contacts = await Contact.find(filter)

        .populate(
            "company",
            "companyName website"
        )

        .populate(
            "createdBy",
            "firstName lastName email"
        )

        .sort({
            createdAt:-1
        })

        .skip(skip)

        .limit(Number(limit));



    const total =
    await Contact.countDocuments(filter);



    return {

        contacts,

        pagination:{

            total,

            page:Number(page),

            limit:Number(limit),

            totalPages:Math.ceil(total/limit)

        }

    };

};




// Get single contact

const getContactById = async(id)=>{


    const contact = await Contact.findOne({

        _id:id,

        isDeleted:false

    })

    .populate(
        "company",
        "companyName website"
    )

    .populate(
        "createdBy",
        "firstName lastName email"
    );


    if(!contact){

        throw new ApiError(
            404,
            "Contact not found"
        );

    }


    return contact;

};




// Update contact

const updateContact = async(id,contactData,userId)=>{


    const contact = await Contact.findOne({

        _id:id,

        isDeleted:false

    });


    if(!contact){

        throw new ApiError(
            404,
            "Contact not found"
        );

    }



    Object.assign(
        contact,
        contactData
    );


    contact.updatedBy=userId;


    await contact.save();



    return contact;

};




// Delete contact

const deleteContact = async(id)=>{


    const contact = await Contact.findOne({

        _id:id,

        isDeleted:false

    });


    if(!contact){

        throw new ApiError(
            404,
            "Contact not found"
        );

    }



    contact.isDeleted=true;


    await contact.save();



    await Company.findByIdAndUpdate(

        contact.company,

        {
            $inc:{
                contactsCount:-1
            }
        }

    );



    return contact;

};




// Restore contact

const restoreContact = async(id)=>{


    const contact = await Contact.findOne({

        _id:id,

        isDeleted:true

    });


    if(!contact){

        throw new ApiError(
            404,
            "Contact not found"
        );

    }



    contact.isDeleted=false;


    await contact.save();



    await Company.findByIdAndUpdate(

        contact.company,

        {
            $inc:{
                contactsCount:1
            }
        }

    );



    return contact;

};



// Get all contacts
const getAllContacts = async (query, user) => {
    const { page = 1, limit = 10, search } = query;
    const filter = { isDeleted: false };
    if (search) {
        filter.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { jobTitle: { $regex: search, $options: "i" } }
        ];
    }

    const userRole = (user?.role || "").toLowerCase();
    if (user && userRole !== "admin" && userRole !== "manager") {
        const rbacOr = [
            { assignedTo: user._id },
            { createdBy: user._id }
        ];
        if (!filter.$or) {
            filter.$or = rbacOr;
        } else {
            filter.$and = [
                { $or: filter.$or },
                { $or: rbacOr }
            ];
            delete filter.$or;
        }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const contacts = await Contact.find(filter)
        .populate("company", "companyName website")
        .populate("assignedTo", "firstName lastName email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
    const total = await Contact.countDocuments(filter);
    return {
        contacts,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit))
        }
    };
};

module.exports={

    createContact,

    getCompanyContacts,

    getAllContacts,

    getContactById,

    updateContact,

    deleteContact,

    restoreContact

};