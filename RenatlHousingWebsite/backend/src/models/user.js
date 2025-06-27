import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  email: { 
    type: String, 
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  role: { 
    type: String, 
    enum: {
      values: [ "tenant", "owner", "user"],
      message: "Role is either: admin, tenant, owner or user"
    },
    required: [true, "Role is required"],
    default: "user"
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
    savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  otp: { 
    type: String, 
    default: null 
  },
  otpExpiration: { 
    type: Date,
    default: null 
  },
  profileImage: { 
    type: String, 
    default: null,
    validate: {
      validator: function(v) {
        return v === null || /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true // 👈 Automatically adds createdAt and updatedAt fields
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isVerified: 1 });
UserSchema.index({ isActive: 1 });

const User = mongoose.model("User", UserSchema);
export default User;