import express from 'express'
import { protectRoute } from '../middleware/auth_middleware.js';
import { deleteNotification, markNotification, getUserNotifications } from '../controllers/notification.js';

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);
router.put("/:id/read", protectRoute, markNotification);
router.delete("/:id", protectRoute, deleteNotification);

export default router;