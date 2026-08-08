const Prospect = require("../../models/Prospect");
const Company = require("../../models/Company");
const Contact = require("../../models/Contact");
const Lead = require("../../models/Lead");
const ApiError = require("../../utils/ApiError");
const notificationService = require("../notification/notification.service");
const fs = require("fs");
const csv = require("csv-parser");


// Helper RBAC check for prospect modification/action permissions
const verifyProspectPermission = (prospect, user, actionName = "modify") => {
    if (!user || typeof user !== "object" || !user.role) return true;

    const userRole = (user.role || "").toLowerCase();
    const userId = (user._id || user.id || "").toString();

    // Admin & Manager have full access to view, edit, convert, delete everything
    if (userRole === "admin" || userRole === "manager") {
        return true;
    }

    // Researcher / User: Allowed only if assigned to user, created by user, or unassigned
    const assignedId = prospect.assignedTo ? prospect.assignedTo.toString() : "";
    const createdById = prospect.createdBy ? prospect.createdBy.toString() : "";

    if (assignedId && assignedId !== userId && createdById && createdById !== userId) {
        throw new ApiError(403, `Access Denied: Only Admin, Manager, or the assigned team member can ${actionName} this prospect.`);
    }

    return true;
};

const verifyAssignmentPermission = (user) => {
    if (!user || typeof user !== "object" || !user.role) return true;
    const userRole = (user.role || "").toLowerCase();
    if (userRole !== "admin" && userRole !== "manager") {
        throw new ApiError(403, "Access Denied: Only Admin and Manager can assign or reassign prospects to team members.");
    }
    return true;
};


// Create Prospect
const createProspect = async (data, user) => {
    const userId = user?._id || user;

    if (data.assignedTo && user && typeof user === "object" && user.role) {
        const userRole = (user.role || "").toLowerCase();
        if (userRole !== "admin" && userRole !== "manager" && data.assignedTo.toString() !== userId.toString()) {
            verifyAssignmentPermission(user);
        }
    }

    const existingProspect = await Prospect.findOne({
        email: data.email,
        isDeleted: false
    });

    if (existingProspect) {
        throw new ApiError(400, "Prospect already exists");
    }

    const prospect = await Prospect.create({
        ...data,
        createdBy: userId,
        updatedBy: userId
    });

    if (prospect.assignedTo && prospect.assignedTo.toString() !== userId.toString()) {
        notificationService.createNotification({
            user: prospect.assignedTo,
            type: "LEAD_ASSIGNED",
            title: "New Prospect Assigned 🎯",
            message: `You have been assigned a new prospect: ${prospect.companyName || prospect.contactName}`,
            referenceId: prospect._id,
            referenceModel: "Prospect"
        }).catch(e => console.error("Notification error:", e.message));
    }

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
const updateProspect = async (id, data, user) => {
    const userId = user?._id || user;

    const prospect = await Prospect.findOne({
        _id: id,
        isDeleted: false
    });

    if (!prospect) {
        throw new ApiError(404, "Prospect not found");
    }

    // RBAC Permission Check
    verifyProspectPermission(prospect, user, "update");

    // Check if assignment is changing
    if (data.assignedTo !== undefined && data.assignedTo !== null) {
        const currentAssigned = prospect.assignedTo ? prospect.assignedTo.toString() : "";
        const newAssigned = data.assignedTo ? data.assignedTo.toString() : "";
        if (currentAssigned !== newAssigned) {
            verifyAssignmentPermission(user);

            if (newAssigned && newAssigned !== userId.toString()) {
                notificationService.createNotification({
                    user: data.assignedTo,
                    type: "LEAD_ASSIGNED",
                    title: "New Prospect Assigned 🎯",
                    message: `You have been assigned a new prospect: ${prospect.companyName || prospect.contactName}`,
                    referenceId: prospect._id,
                    referenceModel: "Prospect"
                }).catch(e => console.error("Notification error:", e.message));
            }
        }
    }

    Object.assign(prospect, data);
    prospect.updatedBy = userId;

    await prospect.save();
    return prospect;
};


// Delete Prospect (Soft Delete)
const deleteProspect = async (id, user) => {
    const prospect = await Prospect.findOne({
        _id: id,
        isDeleted: false
    });

    if (!prospect) {
        throw new ApiError(404, "Prospect not found");
    }

    // RBAC Permission Check
    verifyProspectPermission(prospect, user, "delete");

    prospect.isDeleted = true;
    await prospect.save();

    return prospect;
};

const mongoose = require("mongoose");

const convertProspectToLead = async (prospectId, user) => {
    const userId = user?._id || user;

    if (!mongoose.Types.ObjectId.isValid(prospectId)) {
        throw new ApiError(400, "Invalid Prospect ID format");
    }

    const prospect = await Prospect.findOne({
        _id: prospectId,
        isDeleted: false
    });

    if (!prospect) {
        throw new ApiError(404, "Prospect not found");
    }

    // RBAC Permission Check
    verifyProspectPermission(prospect, user, "convert");

    if (prospect.converted) {
        throw new ApiError(400, "Prospect already converted");
    }

    // 1. Find or create Company for this prospect
    let company = await Company.findOne({
        companyName: { $regex: new RegExp(`^${(prospect.companyName || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
        isDeleted: false
    });

    if (!company) {
        company = await Company.create({
            companyName: prospect.companyName || "Converted Prospect Company",
            website: prospect.website || "",
            country: prospect.location?.country || "",
            city: prospect.location?.city || "",
            employeeCount: prospect.employeeCount || 0,
            createdBy: userId,
            updatedBy: userId
        });
    }

    // 2. Parse contact name safely and create Contact with company reference
    const rawName = (prospect.contactName || "Converted Prospect").trim();
    const nameParts = rawName.split(" ");
    const firstName = nameParts[0] || "Converted";
    const lastName = nameParts.slice(1).join(" ") || "Contact";

    const contact = await Contact.create({
        company: company._id,
        firstName,
        lastName,
        email: prospect.email || "",
        phone: prospect.phone || "",
        jobTitle: prospect.jobTitle || "",
        isPrimary: true,
        createdBy: userId,
        updatedBy: userId
    });

    // 3. Create Lead linking company and contact
    const lead = await Lead.create({
        companyName: prospect.companyName || company.companyName,
        company: company._id,
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
    prospect.status = "Converted";
    prospect.convertedAt = new Date();
    prospect.updatedBy = userId;

    await prospect.save();

    try {
        await notificationService.createNotification({
            user: userId,
            type: "PROSPECT_CONVERTED",
            title: "Prospect Converted to Lead",
            message: `${prospect.companyName || "Prospect"} converted into lead`,
            referenceId: lead._id,
            referenceModel: "Lead"
        });
    } catch (notifErr) {
        console.error("Notification trigger error during prospect conversion:", notifErr.message);
    }

    return {
        company,
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