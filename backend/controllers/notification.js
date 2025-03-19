import Notification from "../models/notification.js"

export const getUserNotifications = async (req, res) => {

    try {
        const notification = await Notification.findOne({ recipient: req.user._id }).sort({ createAt: -1 })
            .populate("relatedUser", "name username headline profilePicture").populate("relatedPost", "content images");

        return res.status(200).json(notification)
    } catch (error) {
        console.error("Error in getNotification", error);
        return res.status(400).json({ error: "In Get-notification" })
    }
}

export const markNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findByIdAndUpdate(
            { _id: notificationId, recipient: req.user._id },
            { read: true }
        )

        res.status(200).json(notification);

    } catch (error) {
        console.error("Error in getNotification", error);
        return res.status(400).json({ error: "In Get-notification" })

    }
}

export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findByIdAndDelete(
            { _id: notificationId, recipient: req.user._id }
        )

        res.status(200).json({ message: "notification deleted successfully" });

    } catch (error) {
        console.error("Error in getNotification", error);
        return res.status(400).json({ error: "In delete-notification" })

    }
}