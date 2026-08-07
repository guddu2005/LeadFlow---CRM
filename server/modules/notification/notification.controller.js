const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const notificationService = require("./notification.service");



// Create Notification
// Used internally by other modules also

exports.createNotification = asyncHandler(async (req, res) => {


    const notification =
        await notificationService.createNotification(
            req.body
        );


    res.status(201).json(

        new ApiResponse(
            201,
            "Notification created successfully",
            notification
        )

    );

});





// Get Logged-in User Notifications

exports.getNotifications = asyncHandler(async (req, res) => {


    const result =
        await notificationService.getUserNotifications(

            req.user._id,

            req.query

        );



    res.status(200).json(

        new ApiResponse(
            200,
            "Notifications fetched successfully",
            result
        )

    );


});






// Get Single Notification

exports.getNotificationById = asyncHandler(async (req, res) => {


    const notification =
        await notificationService.getNotificationById(

            req.params.id,

            req.user._id

        );



    res.status(200).json(

        new ApiResponse(
            200,
            "Notification fetched successfully",
            notification
        )

    );


});







// Mark Notification as Read

exports.markAsRead = asyncHandler(async (req, res) => {


    const notification =
        await notificationService.markAsRead(

            req.params.id,

            req.user._id

        );



    res.status(200).json(

        new ApiResponse(
            200,
            "Notification marked as read",
            notification
        )

    );


});







// Mark All Notifications Read

exports.markAllAsRead = asyncHandler(async (req, res) => {


    await notificationService.markAllAsRead(

        req.user._id

    );



    res.status(200).json(

        new ApiResponse(
            200,
            "All notifications marked as read",
            null
        )

    );


});







// Delete Notification

exports.deleteNotification = asyncHandler(async (req, res) => {


    const notification =
        await notificationService.deleteNotification(

            req.params.id,

            req.user._id

        );



    res.status(200).json(

        new ApiResponse(
            200,
            "Notification deleted successfully",
            notification
        )

    );


});