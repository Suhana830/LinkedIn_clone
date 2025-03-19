import jwt from "jsonwebtoken"
import User from "../models/user_model.js"

export const protectRoute = async (req, res, next) => {
    try {

        const token = req.cookies["jwt-linkedin"];
        if (!token)
            return res.status(401).json({ message: "Unauthorized - No Token provided" });

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });

        }



        const user = await User.findById(decoded.userId);
        if (!user)
            return res.status(401).json({ message: "User not found" });

        req.user = user;
        console.log("req.user :=> ", req.user);
        next();



    } catch (error) {
        console.log("Error in protectRoute :", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}