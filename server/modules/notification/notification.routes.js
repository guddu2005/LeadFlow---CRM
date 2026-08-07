const express = require("express");

const router = express.Router();


const notificationController = require("./notification.controller");


const {
    protect
} = require("../../middleware/auth.middleware");


const validate = require("../../middleware/validate");


const {
    createNotificationValidation,
    notificationIdValidation
} = require("./notification.validation");




// Create Notification
// Mostly used internally by services

router.post(

    "/",

    protect,

    validate(createNotificationValidation),

    notificationController.createNotification

);





// Get all notifications of logged-in user

router.get(

    "/",

    protect,

    notificationController.getNotifications

);






// Get single notification

router.get(

    "/:id",

    protect,

    validate(notificationIdValidation),

    notificationController.getNotificationById

);







// Mark notification as read

router.patch(

    "/:id/read",

    protect,

    validate(notificationIdValidation),

    notificationController.markAsRead

);







// Mark all notifications read

router.patch(

    "/read-all",

    protect,

    notificationController.markAllAsRead

);







// Delete notification

router.delete(

    "/:id",

    protect,

    validate(notificationIdValidation),

    notificationController.deleteNotification

);



module.exports = router;