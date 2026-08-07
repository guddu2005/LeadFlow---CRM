const Company = require("../../models/Company");
const Prospect = require("../../models/Prospect");
const Lead = require("../../models/Lead");
const Outreach = require("../../models/Outreach");
const Interview = require("../../models/Interview");
const Notification = require("../../models/Notification");

const getOverview = async () => {

    const [

        companies,

        prospects,

        leads,

        outreachs,

        interviews,

        notifications

    ] = await Promise.all([

        Company.countDocuments({
            isDeleted: false
        }),

        Prospect.countDocuments({
            isDeleted: false
        }),

        Lead.countDocuments({
            isDeleted: false
        }),

        Outreach.countDocuments({
            isDeleted: false
        }),

        Interview.countDocuments({
            isDeleted: false
        }),

        Notification.countDocuments({
            isDeleted: false
        })

    ]);

    return {

        companies,

        prospects,

        leads,

        outreachs,

        interviews,

        notifications

    };

};

const getFunnel = async () => {

    const [

        prospects,

        contacted,

        replied,

        booked,

        converted

    ] = await Promise.all([

        Prospect.countDocuments({

            isDeleted: false

        }),

        Prospect.countDocuments({

            isDeleted: false,

            status: "Contacted"

        }),

        Prospect.countDocuments({

            isDeleted: false,

            status: "Replied"

        }),

        Prospect.countDocuments({

            isDeleted: false,

            status: "Booked"

        }),

        Lead.countDocuments({

            isDeleted: false

        })

    ]);

    const conversionRate = prospects
        ? Number(((converted / prospects) * 100).toFixed(2))
        : 0;

    return {

        prospects,

        contacted,

        replied,

        booked,

        converted,

        conversionRate

    };

};

const getUpcomingInterviews = async () => {

    const now = new Date();

    const interviews = await Interview.find({

        isDeleted: false,

        status: {
            $in: ["Scheduled", "Rescheduled"]
        },

        scheduledAt: {
            $gte: now
        }

    })

        .populate({
            path: "lead",
            populate: [
                {
                    path: "company",
                    select: "companyName country city"
                },
                {
                    path: "contact",
                    select: "firstName lastName email phone"
                }
            ]
        })

        .sort({
            scheduledAt: 1
        })

        .limit(10);

    return interviews;

};

const getLeadAnalytics = async () => {

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

    const priorityStats = await Lead.aggregate([

        {
            $match: {
                isDeleted: false
            }
        },

        {
            $group: {
                _id: "$priority",
                count: {
                    $sum: 1
                }
            }
        }

    ]);

    return {

        statusStats,

        priorityStats

    };

};

const getOutreachAnalytics = async () => {

    const [
        totalOutreachs,
        sent,
        opened,
        replied,
        booked,
        failed,
        cancelled,
        scheduled,
        draft,
        channelStats,
        statusStats,
        typeStats
    ] = await Promise.all([

        // Total Outreach
        Outreach.countDocuments({
            isDeleted: false
        }),

        // Sent Outreach
        // Includes records that progressed beyond Sent
        Outreach.countDocuments({
            isDeleted: false,
            sentAt: {
                $ne: null
            }
        }),

        // Opened Outreach
        Outreach.countDocuments({
            isDeleted: false,
            openedAt: {
                $ne: null
            }
        }),

        // Replied Outreach
        Outreach.countDocuments({
            isDeleted: false,
            repliedAt: {
                $ne: null
            }
        }),

        // Booked
        Outreach.countDocuments({
            isDeleted: false,
            status: "Booked"
        }),

        // Failed
        Outreach.countDocuments({
            isDeleted: false,
            status: "Failed"
        }),

        // Cancelled
        Outreach.countDocuments({
            isDeleted: false,
            status: "Cancelled"
        }),

        // Scheduled
        Outreach.countDocuments({
            isDeleted: false,
            status: "Scheduled"
        }),

        // Draft
        Outreach.countDocuments({
            isDeleted: false,
            status: "Draft"
        }),

        // Channel Statistics
        Outreach.aggregate([

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

        ]),

        // Status Statistics
        Outreach.aggregate([

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

        ]),

        // Type Statistics
        Outreach.aggregate([

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

        ])

    ]);

    // -------------------------
    // Performance Rates
    // -------------------------
    const templateStats = await Outreach.aggregate([

        {
            $match: {
                isDeleted: false
            }
        },

        {
            $lookup: {
                from: "messagetemplates",
                localField: "template",
                foreignField: "_id",
                as: "template"
            }
        },

        {
            $unwind: {
                path: "$template",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $group: {

                _id: "$template._id",

                templateName: {
                    $first: "$template.name"
                },

                sent: {
                    $sum: {
                        $cond: [
                            {
                                $ne: [
                                    "$sentAt",
                                    null
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },

                opened: {
                    $sum: {
                        $cond: [
                            {
                                $ne: [
                                    "$openedAt",
                                    null
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },

                replied: {
                    $sum: {
                        $cond: [
                            {
                                $ne: [
                                    "$repliedAt",
                                    null
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },

                booked: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$status",
                                    "Booked"
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }

            }

        }

    ]);
    const openRate =
        sent > 0
            ? Number(
                ((opened / sent) * 100).toFixed(2)
            )
            : 0;

    const replyRate =
        sent > 0
            ? Number(
                ((replied / sent) * 100).toFixed(2)
            )
            : 0;

    const bookingRate =
        sent > 0
            ? Number(
                ((booked / sent) * 100).toFixed(2)
            )
            : 0;

    const positiveReplyRate =
        replied > 0
            ? Number(
                ((booked / replied) * 100).toFixed(2)
            )
            : 0;

    return {

        overview: {

            totalOutreachs,

            draft,

            scheduled,

            sent,

            opened,

            replied,

            booked,

            failed,

            cancelled,

            openRate,

            replyRate,

            positiveReplyRate,

            bookingRate

        },

        channelStats,

        statusStats,

        typeStats

    };

};


const getInterviewAnalytics = async () => {

    const totalInterviews = await Interview.countDocuments({

        isDeleted: false

    });

    const statusStats = await Interview.aggregate([

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

    const scheduled =
        statusStats.find(
            item => item._id === "Scheduled"
        )?.count || 0;

    const completed =
        statusStats.find(
            item => item._id === "Completed"
        )?.count || 0;

    const cancelled =
        statusStats.find(
            item => item._id === "Cancelled"
        )?.count || 0;

    const noShow =
        statusStats.find(
            item => item._id === "No Show"
        )?.count || 0;

    const successRate =
        totalInterviews
            ? Number(
                (
                    (completed / totalInterviews) * 100
                ).toFixed(2)
            )
            : 0;

    return {

        totalInterviews,

        scheduled,

        completed,

        cancelled,

        noShow,

        successRate,

        statusStats

    };

};


const getMonthlyData = async (Model) => {

    return await Model.aggregate([

        {
            $match: {
                isDeleted: false
            }
        },

        {
            $group: {

                _id: {

                    year: {
                        $year: "$createdAt"
                    },

                    month: {
                        $month: "$createdAt"
                    }

                },

                count: {
                    $sum: 1
                }

            }

        },

        {
            $sort: {

                "_id.year": 1,

                "_id.month": 1

            }

        }

    ]);

};

const getMonthlyGrowth = async () => {

    const [

        companies,

        prospects,

        leads,

        outreachs,

        interviews

    ] = await Promise.all([

        getMonthlyData(Company),

        getMonthlyData(Prospect),

        getMonthlyData(Lead),

        getMonthlyData(Outreach),

        getMonthlyData(Interview)

    ]);

    return {

        companies,

        prospects,

        leads,

        outreachs,

        interviews,
        templateStats

    };

};

module.exports = {

    getOverview,

    getFunnel,
    getOutreachAnalytics,
    getInterviewAnalytics,
    getMonthlyGrowth

};