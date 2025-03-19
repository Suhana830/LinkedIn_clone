import cloudinary from "../lib/cloudinary.js";
import User from "../models/user_model.js"

export const getSuggestedConnections = async (req, res) => {

    try {
        const currentUser = await User.findById(req.user._id).select("connections");

        const suggestedUser = await User.find({
            _id: {
                $ne: req.user._id, $nin: currentUser.connections
            }
        }).select("name", "username", "profilePicture", "headline").limit(3);

        res.json(suggestedUser);

    }
    catch (error) {
        console.error("Error in getSuggested connections controller :", error);
        res.status(500).json({ message: "server error" });
    }
}

export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password")

        if (!user) {
            return res.status(404).json({ message: "user not found" });

        }

        res.json(user)
    } catch (error) {
        console.error("Error in getPublicProfile controller: ", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {

        const allowedField = [
            "name",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education",

        ];

        let updateData = {};

        for (const field of allowedField) {
            if (req.body[field]) {
                updateData[field] = req.body[field];

            }
        }

        if (req.body.profilePicture) {
            const result = await cloudinary.uploader.upload(req.body.profilePicture);
            updateData.profilePicture = result.secure_url
        }

        if (req.body.bannerImg) {
            const result = await cloudinary.uploader.upload(req.body.bannerImg);
            updateData.bannerImg = result.secure_url
        }

        const user = await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true }).select("-password");
        res.json(user);

    } catch (error) {
        console.error("Error in updateProfile controller: ", error);
        res.status(500).json({ message: "Server error" });

    }
}

