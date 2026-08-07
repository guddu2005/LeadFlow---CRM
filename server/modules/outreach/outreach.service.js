const Outreach = require("../../models/Outreach");
const Prospect = require("../../models/Prospect");
const MessageTemplate = require("../../models/MessageTemplate");

const ApiError = require("../../utils/ApiError");

const notificationService = require("../notification/notification.service");

const {
    renderTemplate
} = require("../../utils/templateRender");


const createOutreach = async (data, userId) => {

    // Find Prospect
    const prospect = await Prospect.findOne({

        _id: data.prospect,

        isDeleted: false

    });

    if (!prospect) {

        throw new ApiError(
            404,
            "Prospect not found"
        );

    }

    // Find Template
    const template = await MessageTemplate.findById(
        data.template
    );

    if (!template) {

        throw new ApiError(
            404,
            "Message Template not found"
        );

    }

    // Render Template
    const rendered = renderTemplate(
        template,
        prospect
    );

    // Create Outreach
    const outreach = await Outreach.create({

        prospect: prospect._id,

        template: template._id,

        templateVersion: template.version,

        channel: data.channel,

        sequenceType:
            data.sequenceType || "Initial",

        sequenceStep:
            data.sequenceType === "Follow Up 1"
                ? 2
                : data.sequenceType === "Follow Up 2"
                ? 3
                : 1,

        subject: rendered.subject,

        message: rendered.message,

        scheduledAt: data.scheduledAt,

        assignedTo:
            data.assignedTo ||
            prospect.assignedTo,

        notes:
            data.notes || "",

        createdBy: userId,

        updatedBy: userId

    });

    // Notification
    await notificationService.createNotification({

        user:
            outreach.assignedTo || userId,

        type: "OUTREACH_CREATED",

        title: "New Outreach",

        message:
            `${outreach.channel} outreach created for ${prospect.companyName}`,

        referenceId: outreach._id,

        referenceModel: "Outreach"

    });

    return await Outreach.findById(
        outreach._id
    )

        .populate(
            "template",
            "name version channel"
        )

        .populate(
            "prospect",
            "companyName contactName email"
        )

        .populate(
            "assignedTo",
            "firstName lastName email"
        )

        .populate(
            "createdBy",
            "firstName lastName email"
        )

        .populate(
            "updatedBy",
            "firstName lastName email"
        );

};

const getOutreachs = async (query) => {

    const {

        page = 1,

        limit = 10,

        channel,

        status,

        assignedTo,

        prospect,

        type,

        sortBy = "createdAt",

        order = "desc"

    } = query;

    const filter = {

        isDeleted: false

    };

    if (channel) {

        filter.channel = channel;

    }

    if (status) {

        filter.status = status;

    }

    if (assignedTo) {

        filter.assignedTo = assignedTo;

    }

    if (prospect) {

        filter.prospect = prospect;

    }

    if (type) {

        filter.type = type;

    }

    const skip =
        (Number(page) - 1)
        *
        Number(limit);

    const outreachs = await Outreach.find(filter)

        .populate(
            "template",
            "name version channel"
        )

        .populate(
            "prospect",
            "companyName contactName email"
        )

        .populate(
            "assignedTo",
            "firstName lastName email"
        )

        .populate(
            "createdBy",
            "firstName lastName email"
        )

        .sort({

            [sortBy]:
                order === "asc"
                    ? 1
                    : -1

        })

        .skip(skip)

        .limit(Number(limit));

    const total =
        await Outreach.countDocuments(filter);

    return {

        outreachs,

        pagination: {

            total,

            page: Number(page),

            limit: Number(limit),

            totalPages:
                Math.ceil(
                    total /
                    Number(limit)
                ),

            hasNextPage:
                Number(page)
                <
                Math.ceil(
                    total /
                    Number(limit)
                ),

            hasPrevPage:
                Number(page) > 1

        }

    };

};

const getProspectTimeline = async (prospectId) => {

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

    const timeline = await Outreach.find({

        prospect: prospectId,

        isDeleted: false

    })

        .populate(
            "template",
            "name version"
        )

        .populate(
            "assignedTo",
            "firstName lastName"
        )

        .populate(
            "createdBy",
            "firstName lastName"
        )

        .sort({

            createdAt: -1

        });

    return {

        prospect,

        timeline

    };

};


const updateOutreach = async (
    id,
    data,
    userId
) => {

    const outreach = await Outreach.findOne({

        _id: id,

        isDeleted: false

    });

    if (!outreach) {

        throw new ApiError(
            404,
            "Outreach not found"
        );

    }

    // These fields cannot be updated
    delete data.template;
    delete data.templateVersion;
    delete data.subject;
    delete data.message;
    delete data.status;
    delete data.prospect;
    delete data.createdBy;
    delete data.updatedBy;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.isDeleted;

    // Update allowed fields
    Object.assign(
        outreach,
        data
    );

    outreach.updatedBy = userId;

    await outreach.save();

    await notificationService.createNotification({

        user:
            outreach.assignedTo || userId,

        type: "OUTREACH_UPDATED",

        title: "Outreach Updated",

        message:
            `${outreach.channel} outreach has been updated.`,

        referenceId: outreach._id,

        referenceModel: "Outreach"

    });

    return await Outreach.findById(
        outreach._id
    )

        .populate(
            "template",
            "name version channel"
        )

        .populate(
            "prospect",
            "companyName contactName email"
        )

        .populate(
            "assignedTo",
            "firstName lastName email"
        )

        .populate(
            "createdBy",
            "firstName lastName email"
        )

        .populate(
            "updatedBy",
            "firstName lastName email"
        );

};

const updateOutreachStatus = async (
    id,
    status,
    userId
) => {

    const outreach = await Outreach.findOne({

        _id: id,

        isDeleted: false

    })

        .populate(
            "prospect"
        )

        .populate(
            "assignedTo",
            "firstName lastName email"
        );

    if (!outreach) {

        throw new ApiError(
            404,
            "Outreach not found"
        );

    }

    outreach.status = status;

    outreach.updatedBy = userId;

    switch (status) {

        case "Scheduled":

            outreach.scheduledAt =
                outreach.scheduledAt || new Date();

            break;

        case "Sent":

            outreach.sentAt = new Date();

            break;

        case "Opened":

            outreach.openedAt = new Date();

            break;

        case "Replied":

            outreach.repliedAt = new Date();

            break;

        case "Booked":

            outreach.repliedAt =
                outreach.repliedAt || new Date();

            break;

        default:

            break;

    }

    await outreach.save();

    // Update Prospect Status
    if (outreach.prospect) {

        switch (status) {

            case "Sent":

                outreach.prospect.status =
                    "Contacted";
                break;

            case "Opened":

                outreach.prospect.status =
                    "Contacted";
                break;

            case "Replied":

                outreach.prospect.status =
                    "Replied";
                break;

            case "Booked":

                outreach.prospect.status =
                    "Booked";
                break;

            default:

                break;

        }

        outreach.prospect.updatedBy = userId;

        await outreach.prospect.save();

    }

    await notificationService.createNotification({

        user:
            outreach.assignedTo?._id || userId,

        type: "OUTREACH_UPDATED",

        title: "Outreach Status Updated",

        message:
            `${outreach.channel} outreach marked as ${status}`,

        referenceId: outreach._id,

        referenceModel: "Outreach"

    });

    return await Outreach.findById(
        outreach._id
    )

        .populate(
            "template",
            "name version channel"
        )

        .populate(
            "prospect",
            "companyName contactName email status"
        )

        .populate(
            "assignedTo",
            "firstName lastName email"
        )

        .populate(
            "updatedBy",
            "firstName lastName email"
        );

};

const deleteOutreach = async (
    id,
    userId
) => {

    const outreach = await Outreach.findOne({

        _id: id,

        isDeleted: false

    });

    if (!outreach) {

        throw new ApiError(
            404,
            "Outreach not found"
        );

    }

    outreach.isDeleted = true;

    outreach.updatedBy = userId;

    await outreach.save();

    await notificationService.createNotification({

        user:
            outreach.assignedTo || userId,

        type: "OUTREACH_UPDATED",

        title: "Outreach Deleted",

        message:
            `${outreach.channel} outreach has been deleted.`,

        referenceId: outreach._id,

        referenceModel: "Outreach"

    });

    return outreach;

};

const getOutreachStats = async () => {

    const total =
        await Outreach.countDocuments({

            isDeleted: false

        });

    const channelStats =
        await Outreach.aggregate([

            {
                $match: {

                    isDeleted: false

                }
            },

            {
                $group: {

                    _id: "$channel",

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

    const statusStats =
        await Outreach.aggregate([

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

    const typeStats =
        await Outreach.aggregate([

            {
                $match: {

                    isDeleted: false

                }
            },

            {
                $group: {

                    _id: "$type",

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

    const replied =
        statusStats.find(
            item => item._id === "Replied"
        )?.count || 0;

    const booked =
        statusStats.find(
            item => item._id === "Booked"
        )?.count || 0;

    return {

        overview: {

            totalOutreachs: total,

            replyRate:
                total
                    ? Number(
                        (
                            replied /
                            total *
                            100
                        ).toFixed(2)
                    )
                    : 0,

            bookingRate:
                total
                    ? Number(
                        (
                            booked /
                            total *
                            100
                        ).toFixed(2)
                    )
                    : 0

        },

        channelStats,

        statusStats,

        typeStats

    };

};



module.exports = {

    createOutreach,

    getOutreachs,

    getProspectTimeline,

    updateOutreach,

    updateOutreachStatus,

    deleteOutreach,

    getOutreachStats

};