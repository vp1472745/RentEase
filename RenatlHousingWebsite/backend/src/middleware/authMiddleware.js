import jwt from "jsonwebtoken";
import User from "../models/user.js"; 

export const authMiddleware = async (req, res, next) => {
  try {
    // ✅ Step 1: Check Cookies से Token आ रहा है या नहीं
    console.log("🔹 Checking Auth Token in Cookies:", req.cookies);

    const token = req.cookies.auth_token;
    if (!token) {
      console.log("❌ Token Not Found in Cookies!");
      return res.status(401).json({ message: "Unauthorized, No Token in Cookies" });
    }

    // ✅ Step 2: JWT Token Verify करो
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    // ✅ Step 3: Database से User Find करो
    req.user = await User.findById(decoded.userId).select("-password");
    console.log("✅ Fetched User Data:", req.user);

    if (!req.user) {
      console.log("❌ User Not Found in Database!");
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);
    res.status(401).json({ message: "Invalid Token" });
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
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: "Unauthorized, No Token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) return res.status(401).json({ message: "User not found" });

    console.log("✅ User Found:", req.user); // Debugging Log
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
