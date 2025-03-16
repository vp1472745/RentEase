import jwt from "jsonwebtoken";
import User from "../models/user.js";

// ✅ Authentication Middleware - Validates Token & Attaches User to Request
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("🔹 Headers Received:", authHeader || "No Auth Header");

    // 🛑 No Token Case
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ No Token Provided!");
      return res.status(401).json({ message: "Unauthorized: No Token Provided" });
    }

    // 🎯 Extract Token
    const token = authHeader.split(" ")[1];
    console.log("🔹 Extracted Token:", token);

    // ✅ Verify Token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token Decoded:", decoded);

      // 🔎 Find User in Database
      const user = await User.findById(decoded.userId).select("-password");

      // 🛑 If User Not Found
      if (!user) {
        console.error("❌ User Not Found!");
        return res.status(401).json({ message: "Unauthorized: User Not Found" });
      }

      // 🔥 Attach User to Request Object
      req.user = user;
      console.log(`✅ Authenticated User: ${user.email} (${user.role})`);

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.error("❌ Token Expired!");
        return res.status(401).json({ message: "Unauthorized: Token Expired" });
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.error("❌ Invalid Token:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid Token" });
      }
      throw error; // 🔥 Any Other Unexpected Error
    }
  } catch (error) {
    console.error("❌ Authentication Middleware Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Owner-Only Middleware - Restricts Access to "owners" Only
export const ownerOnly = (req, res, next) => {
  try {
    console.log("🔹 Checking User Role:", req.user?.role || "No Role Found");

    if (!req.user || !req.user.role) {
      console.error("❌ Role Undefined or User Not Authenticated!");
      return res.status(401).json({ message: "Unauthorized: No Role Defined" });
    }

    // 🎯 Check If User is Owner
    if (req.user.role.toLowerCase() !== "owner") {
      console.error("❌ Access Denied! User Role:", req.user.role);
      return res.status(403).json({ message: "Access Denied: Owners Only" });
    }

    console.log("✅ User Authorized as Owner");
    next();
  } catch (error) {
    console.error("❌ Owner Middleware Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
