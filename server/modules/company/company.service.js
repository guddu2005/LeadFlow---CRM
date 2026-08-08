const Company = require("../../models/Company");
const ApiError = require("../../utils/ApiError");
const uploadToCloudinary = require("../../utils/uploadCloudinary");
const cloudinary = require("../../config/cloudinary");
const Contact = require("../../models/Contact");

const createCompany = async (companyData, userId) => {

    const existingCompany = await Company.findOne({
        companyName: companyData.companyName,
        isDeleted: false
    });

    if (existingCompany) {
        throw new ApiError(409, "Company already exists");
    }

    return await Company.create({
        ...companyData,
        createdBy: userId,
        updatedBy: userId
    });
};

const getCompanies = async (query) => {

    const {
        page = 1,
        limit = 10,
        search,
        status,
        source,
        country,
        priority,
        verificationStatus,
        companyType,
        assignedTo,
        sortBy = "createdAt",
        order = "desc"
    } = query;

    const filter = {
        isDeleted: false
    };

    if (search) {
        filter.$or = [
            {
                companyName: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                website: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                city: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                country: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                currentSoftware: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                companyType: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (country) filter.country = country;
    if (priority) filter.priority = priority;
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (companyType) filter.companyType = companyType;
    if (assignedTo) filter.assignedTo = assignedTo;

    // RBAC: Researcher role sees companies assigned to them OR created by them
    if (user && user.role && user.role.toLowerCase() === "researcher") {
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

    const companies = await Company.find(filter)
        .populate("createdBy", "firstName lastName email role")
        .populate("updatedBy", "firstName lastName email")
        .populate("assignedTo", "firstName lastName email role")
        .sort({
            [sortBy]: order === "asc" ? 1 : -1
        })
        .skip(skip)
        .limit(Number(limit))
        .lean();

    const total = await Company.countDocuments(filter);

    return {
        companies,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
            hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
            hasPrevPage: Number(page) > 1
        }
    };
};

const getCompanyById = async (id) => {

    const company = await Company.findOne({
        _id: id,
        isDeleted: false
    })
        .populate("createdBy", "firstName lastName email role")
        .populate("updatedBy", "firstName lastName email")
        .populate("assignedTo", "firstName lastName email role")
        .lean();


    if (!company) {
        throw new ApiError(404, "Company not found");
    }


    const contacts = await Contact.find({
        company: id,
        isDeleted: false
    })
        .select(
            "firstName lastName email jobTitle linkedinUrl phone emailVerified"
        );


    return {
        ...company,
        contacts
    };
};

const updateCompany = async (id, companyData, userId) => {

    const company = await Company.findOne({
        _id: id,
        isDeleted: false
    });

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    if (
        companyData.companyName &&
        companyData.companyName !== company.companyName
    ) {
        const existingCompany = await Company.findOne({
            companyName: companyData.companyName,
            isDeleted: false,
            _id: { $ne: id }
        });

        if (existingCompany) {
            throw new ApiError(409, "Company already exists");
        }
    }

    Object.assign(company, companyData);

    company.updatedBy = userId;

    await company.save();

    return await Company.findById(company._id)
        .populate("createdBy", "firstName lastName email role")
        .populate("updatedBy", "firstName lastName email")
        .populate("assignedTo", "firstName lastName email role");
};

const deleteCompany = async(id)=>{

    const company = await Company.findOne({
        _id:id,
        isDeleted:false
    });


    if(!company){
        throw new ApiError(404,"Company not found");
    }


    company.isDeleted=true;

    await company.save();


    await Contact.updateMany(
        {
            company:id
        },
        {
            isDeleted:true
        }
    );


    return company;
};

const restoreCompany = async(id)=>{

    const company = await Company.findOne({
        _id:id,
        isDeleted:true
    });


    if(!company){
        throw new ApiError(404,"Company not found");
    }


    company.isDeleted=false;

    await company.save();


    await Contact.updateMany(
        {
            company:id
        },
        {
            isDeleted:false
        }
    );


    return company;
};

const getCompanyStats = async () => {

    const overview = await Company.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: null,
                totalCompanies: { $sum: 1 },
                totalEmployees: { $sum: "$employeeCount" },
                totalUnits: { $sum: "$estimatedUnits" }
            }
        }
    ]);

    const statusStats = await Company.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ]);

    const priorityStats = await Company.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: "$priority",
                count: { $sum: 1 }
            }
        }
    ]);

    const verificationStats = await Company.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: "$verificationStatus",
                count: { $sum: 1 }
            }
        }
    ]);

    return {
        overview: overview[0] || {
            totalCompanies: 0,
            totalEmployees: 0,
            totalUnits: 0
        },
        statusStats,
        priorityStats,
        verificationStats
    };
};

const uploadCompanyLogo = async (id, logoPath, userId) => {

    const company = await Company.findOne({
        _id: id,
        isDeleted: false
    });


    if (!company) {
        throw new ApiError(404, "Company not found");
    }


    // Delete old logo from Cloudinary
    if (company.logoPublicId) {

        await cloudinary.uploader.destroy(
            company.logoPublicId
        );

    }


    // Upload new logo to Cloudinary
    const uploadedLogo = await uploadToCloudinary(
        logoPath
    );


    company.logo = uploadedLogo.url;

    company.logoPublicId = uploadedLogo.public_id;

    company.updatedBy = userId;


    await company.save();


    return await Company.findById(company._id)
        .populate("createdBy", "firstName lastName email role")
        .populate("updatedBy", "firstName lastName email")
        .populate("assignedTo", "firstName lastName email role");
};

module.exports = {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    restoreCompany,
    getCompanyStats,
    uploadCompanyLogo
};