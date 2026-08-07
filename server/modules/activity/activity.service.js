const Activity = require("../../models/Activity");
const Lead = require("../../models/Lead");
const ApiError = require("../../utils/ApiError");

// Create Activity
const createActivity = async (activityData, userId) => {

    const lead = await Lead.findOne({
        _id: activityData.lead,
        isDeleted: false
    });

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    const activity = await Activity.create({
        ...activityData,
        createdBy: userId,
        updatedBy: userId
    });

    // Update lead information automatically
    lead.lastContacted =
        activity.activityDate || new Date();

    if (activity.nextFollowUp) {
        lead.nextFollowUp = activity.nextFollowUp;
    }

    await lead.save();

    return await Activity.findById(activity._id)
        .populate({
            path: "lead",
            populate: [
                {
                    path: "company",
                    select: "companyName logo"
                },
                {
                    path: "contact",
                    select: "firstName lastName email phone"
                }
            ]
        })
        .populate("createdBy", "firstName lastName email role")
        .populate("updatedBy", "firstName lastName email");
};

// Get All Activities
const getActivities = async (query) => {

    const {
        page = 1,
        limit = 10,
        search,
        activityType,
        outcome,
        lead,
        createdBy,
        sortBy = "activityDate",
        order = "desc"
    } = query;

    const filter = {
        isDeleted: false
    };

    if (activityType) {
        filter.activityType = activityType;
    }

    if (outcome) {
        filter.outcome = outcome;
    }

    if (lead) {
        filter.lead = lead;
    }

    if (createdBy) {
        filter.createdBy = createdBy;
    }

    if (search) {
        filter.$or = [
            {
                subject: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const activities = await Activity.find(filter)
        .populate({
            path: "lead",
            populate: [
                {
                    path: "company",
                    select: "companyName"
                },
                {
                    path: "contact",
                    select: "firstName lastName email"
                }
            ]
        })
        .populate("createdBy", "firstName lastName")
        .populate("updatedBy", "firstName lastName")
        .sort({
            [sortBy]: order === "asc" ? 1 : -1
        })
        .skip(skip)
        .limit(Number(limit))
        .lean();

    const total = await Activity.countDocuments(filter);

    return {
        activities,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
            hasNextPage:
                Number(page) < Math.ceil(total / Number(limit)),
            hasPrevPage:
                Number(page) > 1
        }
    };
};

// Get Activity By Id
const getActivityById = async (id) => {

    const activity = await Activity.findOne({
        _id: id,
        isDeleted: false
    })
        .populate({
            path: "lead",
            populate: [
                {
                    path: "company",
                    select: "companyName logo"
                },
                {
                    path: "contact",
                    select: "firstName lastName email phone"
                }
            ]
        })
        .populate("createdBy", "firstName lastName email role")
        .populate("updatedBy", "firstName lastName email");

    if (!activity) {
        throw new ApiError(404, "Activity not found");
    }

    return activity;
};

// Update Activity
const updateActivity = async (id, activityData, userId) => {

    const activity = await Activity.findOne({
        _id: id,
        isDeleted: false
    });

    if (!activity) {
        throw new ApiError(404, "Activity not found");
    }

    if (activityData.lead) {

        const lead = await Lead.findOne({
            _id: activityData.lead,
            isDeleted: false
        });

        if (!lead) {
            throw new ApiError(404, "Lead not found");
        }
    }

    Object.assign(activity, activityData);

    activity.updatedBy = userId;

    await activity.save();

    return await Activity.findById(activity._id)
        .populate({
            path: "lead",
            populate: [
                {
                    path: "company",
                    select: "companyName logo"
                },
                {
                    path: "contact",
                    select: "firstName lastName email phone"
                }
            ]
        })
        .populate("createdBy", "firstName lastName email role")
        .populate("updatedBy", "firstName lastName email");
};

// Soft Delete Activity
const deleteActivity = async (id) => {

    const activity = await Activity.findOne({
        _id: id,
        isDeleted: false
    });

    if (!activity) {
        throw new ApiError(404, "Activity not found");
    }

    activity.isDeleted = true;

    await activity.save();

    return activity;
};

// Restore Activity
const restoreActivity = async (id) => {

    const activity = await Activity.findOne({
        _id: id,
        isDeleted: true
    });

    if (!activity) {
        throw new ApiError(404, "Activity not found");
    }

    activity.isDeleted = false;

    await activity.save();

    return activity;
};

// Get Activities By Lead
const getActivitiesByLead = async (leadId) => {

    const lead = await Lead.findOne({
        _id: leadId,
        isDeleted: false
    });

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    return await Activity.find({
        lead: leadId,
        isDeleted: false
    })
        .populate("createdBy", "firstName lastName email")
        .populate("updatedBy", "firstName lastName email")
        .sort({
            activityDate: -1
        });
};

// Activity Statistics
const getActivityStats = async () => {

    const overview = await Activity.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: null,
                totalActivities: {
                    $sum: 1
                }
            }
        }
    ]);

    const typeStats = await Activity.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: "$activityType",
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

    const outcomeStats = await Activity.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: "$outcome",
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

    return {
        overview: overview[0] || {
            totalActivities: 0
        },
        typeStats,
        outcomeStats
    };
};

module.exports = {
    createActivity,
    getActivities,
    getActivityById,
    updateActivity,
    deleteActivity,
    restoreActivity,
    getActivitiesByLead,
    getActivityStats
};