import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Admin from "../models/adminModals.js";

// ✅ Authentication Middleware
export const authMiddleware = async (req, res, next) => {
  try {
    console.log("🔁 Incoming Auth Request");

    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.auth_token;
    const refreshToken = req.cookies?.refreshToken;
    let token = null;

    if (cookieToken) {
      token = cookieToken;
      console.log("🔐 Token found in cookies");
    } else if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      console.log("🔐 Token found in Authorization header");
    }

    if (!token) {
      console.log("❌ No token found");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No Token Provided",
        shouldRefresh: !!refreshToken,
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token verified");

      const userId = decoded.userId || decoded.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid Token Structure",
          shouldLogout: true,
        });
      }

      let user = await User.findById(userId)
        .select("-password -refreshToken")
        .lean();

      if (!user) {
        const admin = await Admin.findById(userId)
          .select("-password")
          .lean();

        if (admin) {
          user = {
            ...admin,
            _id: admin._id,
            role: admin.role || "admin",
            isActive: true,
          };
          console.log("✅ Admin found:", admin.email);
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User/Admin Not Found",
          shouldLogout: true,
        });
      }

      if (user.role !== "admin" && user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: "Account Deactivated",
          shouldLogout: true,
        });
      }

      req.user = {
        ...user,
        tokenExpiry: decoded.exp,
        tokenIssuedAt: decoded.iat,
      };

      next();
    } catch (error) {
      console.error("❌ Token Error:", error);

      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: "Session Expired",
          shouldRefresh: !!refreshToken,
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          message: "Invalid Session",
          shouldLogout: true,
        });
      }

      throw error;
    }
  } catch (error) {
    console.error("🔥 Authentication Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication Service Unavailable",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Owner-Only Middleware
export const ownerOnly = (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.role) {
      return res.status(401).json({
        success: false,
        message: "Identity Verification Failed",
        shouldRelogin: true,
      });
    }

    const role = user.role.toLowerCase().trim();
    if (role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Resource Restricted to Property Owners",
        requiredRole: "owner",
      });
    }

    res.set({
      "X-Owner-Access": "granted",
      "X-User-ID": user._id,
    });

    next();
  } catch (error) {
    console.error("❌ OwnerOnly Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authorization Service Failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Admin-Only Middleware
export const adminOnly = (req, res, next) => {
  try {
    const user = req.user;
    if (!user || user.role.toLowerCase() !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Administrator Access Required",
      });
    }

    next();
  } catch (error) {
    console.error("❌ AdminOnly Middleware - Error:", error);
    return res.status(500).json({
      success: false,
      message: "Admin Verification Failed",
    });
  }
};

// ✅ Owner or Admin Access
export const ownerOrAdmin = (req, res, next) => {
  try {
    const user = req.user;
    const role = user?.role?.toLowerCase();

    if (role === "owner" || role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Owner or Administrator Access Required",
      });
    }
  } catch (error) {
    console.error("❌ OwnerOrAdmin Middleware - Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authorization Verification Failed",
    });
  }
};

// ✅ Simple Token Verifier (Optional)
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// ✅ Combined Middleware for Owner Routes
export const authOwner = [authMiddleware, ownerOnly];
