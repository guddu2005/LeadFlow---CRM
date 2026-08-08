const Notification = require("../../models/Notification");
const ApiError = require("../../utils/ApiError");
const { getIO } = require("../../socket/socket");


// Create Notification
const createNotification = async (data) => {

    const notification = await Notification.create({
        user: data.user,
        type: data.type,
        title: data.title,
        message: data.message,
        referenceId: data.referenceId || null,
        referenceModel: data.referenceModel || null
    });

    try {
        const io = getIO();
        if (data.user) {
            io.to(data.user.toString()).emit("newNotification", notification);
        }
    } catch(error) {
        console.log("Socket notification emit error:", error.message);
    }

    return notification;
};


// Get User Notifications
const getUserNotifications = async (userId, query) => {

    const {
        page = 1,
        limit = 10,
        unreadOnly
    } = query;

    const filter = {
        user: userId,
        isDeleted: false
    };

    if (unreadOnly === "true") {
        filter.isRead = false;
    }

    const skip =
        (Number(page) - 1) * Number(limit);

    const notifications = await Notification.find(filter)
        .populate(
            "user",
            "firstName lastName email"
        )
        .sort({
            createdAt: -1
        })
        .skip(skip)
        .limit(Number(limit));

    const total =
        await Notification.countDocuments(filter);

    return {
        notifications,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages:
                Math.ceil(total / Number(limit))
        }
    };

};


// Get Single Notification
const getNotificationById = async (id, userId) => {

    const notification =
        await Notification.findOne({
            _id: id,
            user: userId,
            isDeleted: false
        });

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    return notification;
};


// Mark Notification as Read
const markAsRead = async (id, userId) => {

    const notification =
        await Notification.findOne({
            _id: id,
            user: userId,
            isDeleted: false
        });

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    notification.isRead = true;

    await notification.save();

    return notification;
};


// Mark All Notifications Read
const markAllAsRead = async (userId) => {

    await Notification.updateMany(
        {
            user: userId,
            isDeleted: false,
            isRead: false
        },
        {
            $set: {
                isRead: true
            }
        }
    );

    return true;
};


// Delete Notification
const deleteNotification = async (id, userId) => {

    const notification =
        await Notification.findOne({
            _id: id,
            user: userId,
            isDeleted: false
        });

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    notification.isDeleted = true;

    await notification.save();

    return notification;
};


module.exports = {
    createNotification,
    getUserNotifications,
    getNotificationById,
    markAsRead,
    markAllAsRead,
    deleteNotification
};