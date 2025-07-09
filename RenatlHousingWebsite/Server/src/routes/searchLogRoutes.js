import express from "express";
import { saveSearchLog } from "../controller/searchLogController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/search-log", authMiddleware, saveSearchLog);
export default router; 