import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true
    },
    image: {
        type: String,
        default: "" // Default empty string for image URL/path
    },
    
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    role: {
        type: String,
        enum: ["admin", "superadmin"], // you can define more roles
        default: "admin",
      },
  
    
   
}, {
    timestamps: true // This will add createdAt and updatedAt fields automatically
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;

