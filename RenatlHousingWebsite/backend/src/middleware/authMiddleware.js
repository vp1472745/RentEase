import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Enhanced Authentication Middleware
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies?.refreshToken;

    console.log("🔹 Auth Headers:", {
      authHeader: authHeader ? "Present" : "Missing",
      refreshToken: refreshToken ? "Present" : "Missing"
    });

    // 🛑 No Token Case - Enhanced check
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ No Token Provided!");
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: No Token Provided",
        shouldRefresh: !!refreshToken // Indicate if refresh token exists
      });
    }

    // 🎯 Extract Token
    const token = authHeader.split(" ")[1];
    console.log("🔹 Token Extraction:", token ? "Success" : "Failed");

    // ✅ Verify Token with enhanced error handling
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token Decoded:", { 
        userId: decoded.userId, 
        iat: new Date(decoded.iat * 1000).toISOString(),
        exp: new Date(decoded.exp * 1000).toISOString()
      });

      // 🔎 Enhanced User Lookup with caching consideration
      const user = await User.findById(decoded.userId)
        .select("-password -refreshToken")
        .lean();

      // 🛑 If User Not Found - Enhanced response
      if (!user) {
        console.error("❌ User Not Found in Database!");
        return res.status(401).json({ 
          success: false,
          message: "Unauthorized: User Not Found",
          shouldLogout: true
        });
      }

      // 🔥 Attach Enhanced User Object to Request
      req.user = {
        ...user,
        tokenExpiry: decoded.exp,
        tokenIssuedAt: decoded.iat
      };
      
      console.log(`✅ Authenticated: ${user.email} (${user.role}) | Active: ${user.isActive}`);

      // 🛑 Check if account is active
      if (user.isActive === false) {
        console.error("❌ Inactive Account!");
        return res.status(403).json({
          success: false,
          message: "Account Deactivated",
          shouldLogout: true
        });
      }

      next();
    } catch (error) {
      // Enhanced Token Error Handling
      if (error instanceof jwt.TokenExpiredError) {
        console.error("❌ Token Expired at:", new Date(error.expiredAt).toISOString());
        return res.status(401).json({ 
          success: false,
          message: "Session Expired",
          shouldRefresh: !!refreshToken
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.error("❌ Invalid Token:", error.message);
        return res.status(401).json({ 
          success: false,
          message: "Invalid Session",
          shouldLogout: true
        });
      }
      console.error("🔴 Critical JWT Error:", error);
      throw error;
    }
  } catch (error) {
    console.error("❌ Auth Middleware Failure:", error.stack);
    return res.status(500).json({ 
      success: false,
      message: "Authentication Service Unavailable",
      systemError: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Enhanced Owner-Only Middleware
export const ownerOnly = (req, res, next) => {
  try {
    const user = req.user;
    console.log("🔹 Role Verification:", {
      userId: user?._id,
      role: user?.role,
      path: req.path
    });

    // 🛑 Comprehensive Access Checks
    if (!user || !user.role) {
      console.error("❌ Access Violation: No User/Role");
      return res.status(401).json({ 
        success: false,
        message: "Identity Verification Failed",
        shouldRelogin: true
      });
    }

    // 🎯 Role Validation with case-insensitive check
    const normalizedRole = user.role.toString().toLowerCase().trim();
    if (normalizedRole !== "owner") {
      console.error("❌ Role Violation:", {
        required: "owner",
        provided: user.role
      });
      return res.status(403).json({ 
        success: false,
        message: "Resource Restricted to Property Owners",
        requiredRole: "owner"
      });
    }

    // ✅ Success Logging
    console.log("✅ Owner Access Granted:", {
      userId: user._id,
      email: user.email
    });

    // 🛡️ Add Security Headers for Owner Routes
    res.set({
      'X-Owner-Access': 'granted',
      'X-User-ID': user._id
    });

    next();
  } catch (error) {
    console.error("❌ Owner Middleware Crash:", error.stack);
    return res.status(500).json({ 
      success: false,
      message: "Authorization Service Failed",
      systemError: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// New: Combined Auth + Owner Middleware
export const authOwner = [authMiddleware, ownerOnly];

// New: Admin-Only Middleware (Bonus)
export const adminOnly = (req, res, next) => {
  try {
    const user = req.user;
    if (!user || user.role.toLowerCase() !== "admin") {
      console.error("Admin Access Denied for:", user?.email);
      return res.status(403).json({ 
        success: false,
        message: "Administrator Access Required"
      });
    }
    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    res.status(500).json({ message: "Admin Verification Failed" });
  }
};