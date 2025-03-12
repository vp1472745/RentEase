import express from "express";
import { addProperty, getAllProperties, getPropertyById, searchProperties } from "../controller/propertyController.js";
import { protect,ownerOnly } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/search", searchProperties); // ✅ Search Property

router.get("/", getAllProperties); // 🔹 Get All Available Properties

router.get("/:id", getPropertyById); // 🔹 Get Property by ID

router.post("/add", protect, ownerOnly, addProperty); // 🔹 Only Owner can Add Property

export default router;
