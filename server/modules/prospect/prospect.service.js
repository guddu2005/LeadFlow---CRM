const Prospect = require("../../models/Prospect");
const Company = require("../../models/Company");
const Contact = require("../../models/Contact");
const Lead = require("../../models/Lead");
const ApiError = require("../../utils/ApiError");
const notificationService = require("../notification/notification.service");
const fs = require("fs");
const csv = require("csv-parser");


// Create Prospect

const createProspect = async (data, userId) => {

    const existingProspect = await Prospect.findOne({
        email: data.email,
        isDeleted: false
    });


    if (existingProspect) {

        throw new ApiError(
            400,
            "Prospect already exists"
        );

    }


    const prospect = await Prospect.create({

        ...data,

        createdBy: userId,

        updatedBy: userId

    });


    return prospect;

};



// Get All Prospects

const getProspects = async (query) => {

    const {
        page = 1,
        limit = 10,
        status,
        source,
        country,
        jobTitle,
        currentSoftware,
        search
    } = query;


    const filter = {

        isDeleted: false

    };


    if (status) {

        filter.status = status;

    }


    if (source) {

        filter.source = source;

    }


    if (country) {

        filter["location.country"] = country;

    }


    if (jobTitle) {

        filter.jobTitle = {
            $regex: jobTitle,
            $options: "i"
        };

    }


    if (currentSoftware) {

        filter.currentSoftware = {
            $regex: currentSoftware,
            $options: "i"
        };

    }


    if (search) {

        filter.$or = [

            {
                companyName: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                contactName: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                email: {
                    $regex: search,
                    $options: "i"
                }
            }

        ];

    }


    const skip =
        (Number(page) - 1)
        *
        Number(limit);



    const prospects = await Prospect.find(filter)

        .populate(
            "assignedTo",
            "firstName lastName email"
        )

        .sort({
            createdAt: -1
        })

        .skip(skip)

        .limit(Number(limit));



    const total =
        await Prospect.countDocuments(filter);



    return {

        prospects,

        pagination: {

            total,

            page: Number(page),

            limit: Number(limit),

            totalPages:
                Math.ceil(total / Number(limit))

        }

    };

};



// Get Single Prospect

const getProspectById = async (id) => {


    const prospect =
        await Prospect.findOne({

            _id: id,

            isDeleted: false

        })

            .populate(
                "assignedTo",
                "firstName lastName email"
            );


    if (!prospect) {

        throw new ApiError(
            404,
            "Prospect not found"
        );

    }


    return prospect;

};



// Update Prospect

const updateProspect = async (
    id,
    data,
    userId
) => {


    const prospect =
        await Prospect.findOne({

            _id: id,

            isDeleted: false

        });



    if (!prospect) {

        throw new ApiError(
            404,
            "Prospect not found"
        );

    }



    Object.assign(
        prospect,
        data
    );


    prospect.updatedBy = userId;


    await prospect.save();



    return prospect;

};



// Delete Prospect (Soft Delete)

const deleteProspect = async (id) => {


    const prospect =
        await Prospect.findOne({

            _id: id,

            isDeleted: false

        });



    if (!prospect) {

        throw new ApiError(
            404,
            "Prospect not found"
        );

    }



    prospect.isDeleted = true;


    await prospect.save();



    return prospect;

};

const convertProspectToLead = async (
    prospectId,
    userId
) => {

    const prospect = await Prospect.findOne({
        _id: prospectId,
        isDeleted: false
    });

    if (!prospect) {

        throw new ApiError(
            404,
            "Prospect not found"
        );

    }


    if (prospect.converted) {

        throw new ApiError(
            400,
            "Prospect already converted"
        );

    }


    const nameParts =
        prospect.contactName.split(" ");

    const contact = await Contact.create({
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" ") || "",
        email: prospect.email,
        phone: prospect.phone,
        jobTitle: prospect.jobTitle,
        createdBy: userId,
        updatedBy: userId
    });

    const lead = await Lead.create({
        companyName: prospect.companyName,
        website: prospect.website || "",
        contact: contact._id,
        source: prospect.source || "Manual",
        status: "Not Contacted",
        notes: prospect.notes || "",
        signal: prospect.signal || "",
        isConvertedToCompany: false,
        createdBy: userId,
        updatedBy: userId
    });

    prospect.converted = true;
    prospect.convertedLead = lead._id;
    prospect.convertedAt = new Date();
    prospect.updatedBy = userId;

    await prospect.save();

    await notificationService.createNotification({
        user: userId,
        type: "PROSPECT_CONVERTED",
        title: "Prospect Converted to Lead",
        message: `${prospect.companyName} converted into lead`,
        referenceId: lead._id,
        referenceModel: "Lead"
    });

    return {
        contact,
        lead
    };


};
const importProspects = async (
    filePath,
    userId
) => {

    const rows = [];

    await new Promise((resolve, reject) => {

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => {

                rows.push(data);

            })
            .on("end", resolve)
            .on("error", reject);

    });

    let imported = 0;
    let duplicates = 0;
    let failed = 0;

    for (const row of rows) {

        try {

            const existing = await Prospect.findOne({
                email: row.email,
                isDeleted: false
            });

            if (existing) {
                duplicates++;
                continue;
            }
            await Prospect.create({
                companyName: row.companyName,
                website: row.website,
                location: {
                    country: row.country,
                    city: row.city
                },
                estimatedUnits:
                    Number(row.estimatedUnits) || 0,
                employeeCount:
                    Number(row.employeeCount) || 0,
                contactName: row.contactName,
                jobTitle: row.jobTitle,
                linkedinUrl: row.linkedinUrl,
                email: row.email,
                phone: row.phone,
                currentSoftware: row.currentSoftware,
                signal: row.signal,
                source: row.source || "Manual",
                status:
                    row.status || "Not Contacted",
                notes: row.notes,
                createdBy: userId,
                updatedBy: userId
            });
            imported++;
        } catch (err) {
            failed++;
        }
    }
    return {
        totalRows: rows.length,
        imported,
        duplicates,
        failed
    };

};



module.exports = {

    createProspect,
    convertProspectToLead,
    getProspects,
    importProspects,
    getProspectById,

    updateProspect,

    deleteProspect

};