const Lead = require("../../models/Lead");
const Company = require("../../models/Company");
const Contact = require("../../models/Contact");
const ApiError = require("../../utils/ApiError");

const LeadAssignmentHistory = require("../../models/LeadAssignmentHistory");
const User = require("../../models/User");
const notificationService = require("../notification/notification.service");



const createLead = async (leadData, userId) => {
    let companyId = leadData.company;
    let contactId = leadData.contact;

    if (!companyId && leadData.companyName) {
        let comp = await Company.findOne({ companyName: leadData.companyName, isDeleted: false });
        if (!comp) {
            comp = await Company.create({
                companyName: leadData.companyName,
                website: leadData.website || "",
                assignedTo: leadData.assignedTo || userId,
                createdBy: userId,
                updatedBy: userId
            });
        }
        companyId = comp._id;
    }

    if (!contactId && (leadData.contactFirstName || leadData.email)) {
        let cont = await Contact.findOne({
            $or: [
                { email: leadData.email || "noemail@leadflow.com" },
                { firstName: leadData.contactFirstName, company: companyId }
            ],
            isDeleted: false
        });
        if (!cont) {
            cont = await Contact.create({
                firstName: leadData.contactFirstName || "Primary",
                lastName: leadData.contactLastName || "Contact",
                email: leadData.email || `contact_${Date.now()}@leadflow-crm.com`,
                phone: leadData.phone || "",
                jobTitle: leadData.jobTitle || "Executive",
                company: companyId,
                createdBy: userId,
                updatedBy: userId
            });
        }
        contactId = cont._id;
    }

    return await Lead.create({
        ...leadData,
        company: companyId,
        contact: contactId,
        assignedTo: leadData.assignedTo || userId,
        createdBy: userId,
        updatedBy: userId
    });
};

const getLeads = async (query, user) => {

    const {
        page = 1,
        limit = 10,
        search,
        status,
        priority,
        source,
        assignedTo,
        sortBy = "createdAt",
        order = "desc"
    } = query;

    const filter = {
        isDeleted: false
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (source) filter.source = source;
    if (assignedTo) filter.assignedTo = assignedTo;

    // RBAC: Researcher role sees leads assigned to them OR created by them
    if (user && user.role && user.role.toLowerCase() === "researcher") {
        filter.$or = [
            { assignedTo: user._id },
            { createdBy: user._id }
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    let leads = await Lead.find(filter)
        .populate("company", "companyName website country city")
        .populate(
            "contact",
            "firstName lastName email phone jobTitle linkedinUrl"
        )
        .populate(
            "assignedTo",
            "firstName lastName email role"
        )
        .populate(
            "createdBy",
            "firstName lastName"
        )
        .populate(
            "updatedBy",
            "firstName lastName"
        )
        .sort({
            [sortBy]: order === "asc" ? 1 : -1
        })
        .skip(skip)
        .limit(Number(limit))
        .lean();

    // Search by company/contact after populate
    if (search) {

        const keyword = search.toLowerCase();

        leads = leads.filter((lead) => {

            const company =
                lead.company?.companyName?.toLowerCase() || "";

            const contact =
                `${lead.contact?.firstName || ""} ${lead.contact?.lastName || ""}`
                    .toLowerCase();

            return (
                company.includes(keyword) ||
                contact.includes(keyword)
            );
        });
    }

    const total = await Lead.countDocuments(filter);

    return {
        leads,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
            hasNextPage:
                Number(page) <
                Math.ceil(total / Number(limit)),
            hasPrevPage:
                Number(page) > 1
        }
    };
};

const getLeadById = async (id) => {

    const lead = await Lead.findOne({
        _id: id,
        isDeleted: false
    })
        .populate("company")
        .populate("contact")
        .populate("assignedTo", "firstName lastName email role")
        .populate("createdBy", "firstName lastName email")
        .populate("updatedBy", "firstName lastName email");

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    return lead;
};

const verifyLeadPermission = (lead, user, actionName = "modify") => {
    if (!user || typeof user !== "object" || !user.role) return true;
    const userRole = (user.role || "").toLowerCase();
    const userId = (user._id || user.id || "").toString();

    if (userRole === "admin" || userRole === "manager") {
        return true;
    }

    const assignedId = lead.assignedTo ? lead.assignedTo.toString() : "";
    const createdById = lead.createdBy ? lead.createdBy.toString() : "";

    if (assignedId && assignedId !== userId && createdById && createdById !== userId) {
        throw new ApiError(403, `Access Denied: Only Admin, Manager, or the assigned team member can ${actionName} this lead.`);
    }

    return true;
};

const verifyLeadAssignPermission = (user) => {
    if (!user || typeof user !== "object" || !user.role) return true;
    const userRole = (user.role || "").toLowerCase();
    if (userRole !== "admin" && userRole !== "manager") {
        throw new ApiError(403, "Access Denied: Only Admin and Manager can assign or reassign leads to team members.");
    }
    return true;
};

const updateLead = async (id, leadData, user) => {
    const userId = user?._id || user;

    const lead = await Lead.findOne({
        _id: id,
        isDeleted: false
    });

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    // RBAC Permission Check
    verifyLeadPermission(lead, user, "update");

    // Check if assignment is changing
    if (leadData.assignedTo !== undefined && leadData.assignedTo !== null) {
        const currentAssigned = lead.assignedTo ? lead.assignedTo.toString() : "";
        const newAssigned = leadData.assignedTo ? leadData.assignedTo.toString() : "";
        if (currentAssigned !== newAssigned) {
            verifyLeadAssignPermission(user);
        }
    }

    if (leadData.company || leadData.contact) {
        const companyId = leadData.company || lead.company;
        const contactId = leadData.contact || lead.contact;

        const contact = await Contact.findOne({
            _id: contactId,
            company: companyId,
            isDeleted: false
        });

        if (!contact) {
            throw new ApiError(404, "Contact does not belong to selected company");
        }

        const duplicate = await Lead.findOne({
            _id: { $ne: id },
            company: companyId,
            contact: contactId,
            isDeleted: false
        });

        if (duplicate) {
            throw new ApiError(409, "Lead already exists");
        }
    }

    Object.assign(lead, leadData);
    lead.updatedBy = userId;

    await lead.save();
    return await getLeadById(lead._id);
};

const deleteLead = async (id, user) => {
    const lead = await Lead.findOne({
        _id: id,
        isDeleted: false
    });

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    // RBAC Permission Check
    verifyLeadPermission(lead, user, "delete");

    lead.isDeleted = true;
    await lead.save();

    return lead;
};

const restoreLead = async (id) => {

    const lead = await Lead.findOne({
        _id: id,
        isDeleted: true
    });

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    lead.isDeleted = false;

    await lead.save();

    return lead;
};

const getLeadStats = async () => {

    const overview = await Lead.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: null,
                totalLeads: {
                    $sum: 1
                }
            }
        }
    ]);

    const statusStats = await Lead.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: "$status",
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ]);

    const sourceStats = await Lead.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: "$source",
                count: {
                    $sum: 1
                }
            }
        }
    ]);

    return {
        overview: overview[0] || {
            totalLeads: 0
        },
        statusStats,
        sourceStats
    };
};


const assignLead = async (
    leadId,
    assignedTo,
    user
) => {
    const userId = user?._id || user;
    verifyLeadAssignPermission(user);

    const lead = await Lead.findOne({
        _id: leadId,
        isDeleted: false
    });

    if (!lead) {
        throw new ApiError(
            404,
            "Lead not found"
        );
    }

    const targetUser = await User.findById(
        assignedTo
    );

    if (!targetUser) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    lead.assignedTo = assignedTo;

    await lead.save();

    await LeadAssignmentHistory.create({
        lead: leadId,
        assignedBy: userId,
        assignedTo
    });

    await notificationService.createNotification({
        user: assignedTo,
        type: "LEAD_ASSIGNED",
        title: "New Lead Assigned",
        message:
            `A new lead has been assigned to you`,
        referenceId: leadId,
        referenceModel: "Lead"
    });

    return lead;

};

const convertLeadToCompany = async (leadId, userId) => {
    const lead = await Lead.findOne({ _id: leadId, isDeleted: false }).populate("contact");
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    if (lead.isConvertedToCompany) {
        throw new ApiError(400, "Lead is already converted to a Company Account");
    }

    const company = await Company.create({
        companyName: lead.companyName || lead.company?.companyName || "Target Account",
        website: lead.website || lead.company?.website || "",
        country: "Unknown",
        city: "",
        source: lead.source || "Manual",
        status: "Booked",
        notes: lead.notes || "",
        contactsCount: 1,
        leadCount: 1,
        assignedTo: lead.assignedTo || userId,
        createdBy: userId,
        updatedBy: userId
    });

    lead.company = company._id;
    lead.isConvertedToCompany = true;
    lead.convertedCompany = company._id;
    lead.status = "Booked";
    lead.updatedBy = userId;
    await lead.save();

    if (lead.contact) {
        await Contact.findByIdAndUpdate(lead.contact._id || lead.contact, {
            company: company._id,
            updatedBy: userId
        });
    }

    await notificationService.createNotification({
        user: userId,
        type: "LEAD_CONVERTED_TO_COMPANY",
        title: "Lead Converted to Company",
        message: `${company.companyName} stored in Companies collection`,
        referenceId: company._id,
        referenceModel: "Company"
    });

    return { company, lead };
};

module.exports = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    restoreLead,
    getLeadStats,
    assignLead,
    convertLeadToCompany
};