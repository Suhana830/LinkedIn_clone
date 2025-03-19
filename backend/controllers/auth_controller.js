import User from "../models/user_model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import { sendWelcomeEmail } from "../emails/emailHandler.js";

export const signup = async (req, res) => {


    try {

        const { name, username, email, password } = req.body;
        // console.log(req.body);

        if (!name || !username || !email || !password)
            return res.status(400).json({ message: "all field are required" })

        const exist_Email = await User.findOne({ email: email });
        if (exist_Email) {
            console.log("exisitng ", exist_Email.username)
            return res.status(400).json({ message: "Email already exists___" });

        }





        const exist_username = await User.findOne({ username: username });

        if (exist_username) {
            return res.status(400).json({ message: "Username already exists" });

        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });

        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("-----hello")

        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            username: username,
            salt: salt
        })

        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

        res.cookie("jwt-linkedin", token, {
            httpOnly: true, //prevent XSS attack
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict", //prevent CSRF attack
            secure: process.env.NODE_ENV === "production", // prevent man-in-the middle attacks
        })

        res.status(201).json({ message: "User registered successfully" })

        const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username
        try {

            await sendWelcomeEmail(user.email, user.name, profileUrl);

        } catch (email_error) {
            console.error("Error sending welcome Email", email_error);
            res.status(500).json({ message: "Internal Server error" });
        }



    } catch (error) {

        console.log("Error in signup: ", error.message);
        res.status(500).json({ message: "Internal server error" });


    }
}

export const login = async (req, res) => {

    try {

        let { username, password } = req.body;
        password = password.toString();

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const isMath = bcrypt.compareSync(password, user.password);
        if (!isMath) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "3d" });

        await res.cookie("jwt-linkedin", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production'
        })


        res.json({ message: "Logged in successfully" });
    } catch (error) {
        console.error("Error in login controller :", error);
        res.status(500).json({ message: "server error" })
    }

}

export const logout = (req, res) => {

    res.clearCookie("jwt-linkedin")
    res.send("logout")
}