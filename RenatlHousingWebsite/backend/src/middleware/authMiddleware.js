import jwt from "jsonwebtoken";
import User from "../models/user.js"; 

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔹 Check if Authorization Header is Missing
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No Token Provided!");  // Debugging Log
      return res.status(401).json({ message: "Unauthorized, No Token Provided" });
    }

    const token = authHeader.split(" ")[1]; // 🔹 Extract Token

    // 🔹 Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Decoded Token Data:", decoded); // ✅ Debugging Log

    // 🔹 Find User in Database
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      console.log("❌ User Not Found in DB!");  // Debugging Log
      return res.status(401).json({ message: "Unauthorized, User Not Found" });
    }

    req.user = user; // 🔹 Attach User Data to `req.user`
    
    console.log("✅ User Authenticated:", user.email);  // Debugging Log
    next(); // 🔹 Move to the next Middleware

  } catch (error) {
    console.log("❌ Token Verification Failed:", error.message); // Debugging Log
    return res.status(401).json({ message: "Unauthorized, Invalid Token" });
  }
};
export const ownerOnly = (req, res, next) => {
  console.log("🔹 Checking User Role:", req.user?.role);

  if (!req.user) {
    console.log("❌ req.user is undefined!");
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  if (req.user.role !== "owner") {
    console.log("❌ Access Denied! Role is:", req.user.role);
    return res.status(403).json({ message: "Access Denied, Owners Only" });
  }

  console.log("✅ User Authorized as Owner");
  next();
};

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized, No Token" });
    }

    const token = authHeader.split(" ")[1]; // Extract Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) return res.status(401).json({ message: "User not found" });

    console.log("✅ User Found:", req.user); // Debugging Log
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
