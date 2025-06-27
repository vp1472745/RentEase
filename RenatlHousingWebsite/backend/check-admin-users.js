import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./src/models/adminModals.js";

dotenv.config();

const checkAdminUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/RentEaseDB");
    console.log("✅ Connected to MongoDB");

    // Find all admin users
    const admins = await Admin.find({}).select('name email role createdAt');
    
    console.log("\n📋 Admin Users in Database:");
    if (admins.length === 0) {
      console.log("❌ No admin users found");
    } else {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Name: ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log("---");
      });
    }

    // Check if any admin has role set to "admin"
    const adminRoleUsers = admins.filter(admin => admin.role === 'admin');
    console.log(`\n✅ Admins with role 'admin': ${adminRoleUsers.length}`);
    
    // Check for users without role field
    const usersWithoutRole = admins.filter(admin => !admin.role);
    console.log(`⚠️  Admins without role field: ${usersWithoutRole.length}`);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

checkAdminUsers(); 