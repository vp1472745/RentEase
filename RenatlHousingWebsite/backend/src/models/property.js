import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  popularLocality: { type: String, required: true },
  images: [{ type: String }], 
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Property Details
  propertyType: { 
    type: [String],  
    enum: ['apartment', 'independent floor', 'independent house', 'farm house'], 
    required: true 
  },
  bhkType: { 
    type: [String],  
    enum: ['1RK', '1BHK', '1.5BHK', '2BHK', '3+BHK'],
    required: true 
  },
  furnishType: { 
    type: [String],  
    enum: ['fully furnished', 'semi furnished', 'unfurnished'], 
    required: true 
  },
  area: { type: Number, required: true },
  floorNumber: { type: Number },
  totalFloors: { type: Number },
  ageOfProperty: { type: Number },
  facingDirection: { 
    type: String, 
    enum: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'] 
  },

  // Facilities & Features
  facilities: { 
    type: [String], 
    enum: ['electricity', 'wifi', 'water supply', 'parking', 'security', 'lift', 'gym', 'swimming pool'], 
    required: true 
  },
  balcony: { type: Boolean, default: false },
  petsAllowed: { type: Boolean, default: false },
  nonVegAllowed: { type: Boolean, default: false },
  smokingAllowed: { type: Boolean, default: false },
  bachelorAllowed: { type: Boolean, default: false },
  parking: { 
    type: String, 
    enum: ['None', 'Street', 'Allocated', 'Garage'] 
  },
  waterSupply: { 
    type: String, 
    enum: ['Corporation', 'Borewell', 'Both'] 
  },
  electricityBackup: { 
    type: String, 
    enum: ['None', 'Inverter', 'Generator'] 
  },
  maintenanceCharges: { type: Number },

  // Rent & Availability
  monthlyRent: { type: Number, required: true },
  availableFrom: { type: Date, required: true },
  securityDeposit: { type: Number, required: true },
  rentalDurationMonths: { type: Number, required: true },

  // Owner Information
  nearby: { type: [String], required: true },
  Gender: { type: String, enum: ["Male", "Female", "Unisex"], required: true },
  ownerphone: { type: String, required: true },
  ownerName: { type: String, required: true },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for better query performance
propertySchema.index({ city: 1 });
propertySchema.index({ monthlyRent: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ bhkType: 1 });
propertySchema.index({ furnishType: 1 });

const Property = mongoose.model("Property", propertySchema);

export default Property;