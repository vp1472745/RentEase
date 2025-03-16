import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  
  images: [{ type: String }], // Multiple images
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // ✅ Updated Fields
  propertyType: { 
    type: [String],  // ✅ Array to allow multiple selections
    enum: ['apartment', 'independent floor', 'independent house', 'farm house'], 
    required: true 
  },

  bhkType: { 
    type: [String],  // ✅ Allow multiple BHK types
    enum: ['1RK', '1BHK', '1.5BHK', '2BHK', '3+BHK'], 
    required: true 
  },

  furnishType: { 
    type: [String],  // ✅ Allow multiple furnishing types
    enum: ['fully furnished', 'semi furnished', 'unfurnished'], 
    required: true 
  },

  area: { type: Number, required: true }, // in square feet

  // ✅ Facilities ko dynamic banaya
  facilities: { 
    type: [String], 
    enum: ['electricity', 'wifi', 'water supply', 'parking', 'security', 'lift', 'gym', 'swimming pool'], 
    required: true 
  },

  monthlyRent: { type: Number, required: true },
  availableFrom: { type: Date, required: true },
  // price: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  rentalDurationMonths: { type: Number, required: true }, // in months
});

const Property = mongoose.model("Property", propertySchema);

export default Property;
