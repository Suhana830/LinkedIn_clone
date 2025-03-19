import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "https://upload.wikimedia.org/wikipedia/commons/2/24/Missing_avatar.svg" },
    bannerImg: { type: String, default: "" },
    headline: { type: String, default: "Linkedin User" },
    about: { type: String, default: "" },
    location: { type: String, default: "Earth" },
    skills: [String],
    experience: [
        {
            title: String,
            company: String,
            startDate: Date,
            endDate: Date,
            description: String
        }
    ],
    education: [
        {
            institue: String,
            fieldOfStudy: String,
            startYear: Number,
            endYear: Number
        }
    ],
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    salt: {
        type: String,
        require: true,
    },


}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;