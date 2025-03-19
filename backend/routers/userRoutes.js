import express from "express";
import { protectRoute } from "../middleware/auth_middleware.js";
import { getSuggestedConnections, getPublicProfile, updateProfile } from "../controllers/userController.js";
const router = express.Router();

router.get("/suggestions", protectRoute, getSuggestedConnections);
router.get("/:username", protectRoute, getPublicProfile);

router.post("/profile", protectRoute, updateProfile);
export default router;
