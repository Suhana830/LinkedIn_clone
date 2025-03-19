import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routers/authRoutes.js"
import userRoutes from "./routers/userRoutes.js"
import postRoutes from "./routers/postRoute.js";
import notificationRoutes from "./routers/notificationRoutes.js"
import connectionRoutes from "./routers/connectionsRoutes.js";

import cors from 'cors'
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json()); // parse json request bodies
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);


app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
    connectDB();
})