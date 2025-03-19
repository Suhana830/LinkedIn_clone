import express from "express"
import { signup, login, logout } from "../controllers/auth_controller.js";
import { protectRoute } from "../middleware/auth_middleware.js";
import { getCurrentUser } from "../controllers/connectionRequest_controller.js";

const router = express.Router();

router.get("/hello", (req, res) => {
    res.send("hello");
})

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protectRoute, getCurrentUser);

export default router;