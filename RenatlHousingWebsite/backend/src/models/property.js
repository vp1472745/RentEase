import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    // Basic Information
    // title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    popularLocality: { type: String },
    images: {
      type: [{
        url: {
          type: String,
          required: true,
          validate: {
            validator: function(v) {
              return v.match(/^http(s)?:\/\/.+\..+/) !== null;
            },
            message: props => `${props.value} is not a valid image URL!`
          }
        },
        type: {
          type: String,
          default: ""
        }
      }],
      set: function(images) {
        // Convert plain strings to objects
        return images.map(img => 
          typeof img === 'string' 
            ? { url: img, type: '' } 
            : img
        );
      }
    },

 // In your Property model (backend)
 videos: {
  type: [{
    url: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+\..+/.test(v);
        },
        message: props => `${props.value} is not a valid video URL!`
      }
    },
    public_id: { 
      type: String, 
      required: true 
    },
    type: { 
      type: String, 
      default: "video" 
    }
  }],
  validate: {
    validator: function(v) {
      // Allow empty array or array with valid video objects
      return v.every(video => video.url && video.public_id);
    },
    message: "Videos must have both URL and public_id"
  }
},
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerName: { type: String, required: true },
    ownerphone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{10,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },

    Gender: {
      type: [String],
      required: true,
      enum: [
        "Couple Friendly",
        "Family",
        "Student",
        "Working professional",
        "Single",
      ],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one gender preference must be selected",
      },
    },

    // Property Details
    propertyType: {
      type: [String],
      required: true,
      enum: [
        "apartment",
        "independent floor",
        "independent house",
        "farm house",
      ],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one property type must be selected",
      },
    },
    bhkType: {
      type: [String],
      required: true,
      enum: ["1RK", "2BHK", "3BHK", "4+BHK"],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one BHK type must be selected",
      },
    },
    furnishType: {
      type: [String],
      required: true,
      enum: ["fully furnished", "semi furnished", "unfurnished"],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one furnish type must be selected",
      },
    },
    area: {
      type: Number,
      required: true,
      min: [50, "Area must be at least 50 sq. ft"],
    },
    floorNumber: { type: Number },
    totalFloors: { type: Number },
    ageOfProperty: { type: Number },
    facingDirection: {
      type: String,
      enum: [
        "North",
        "South",
        "East",
        "West",
        "North-East",
        "North-West",
        "South-East",
        "South-West",
      ],
    },

    
    nearby: {
      type: [String],},


  

    // Facilities & Features
    facilities: {
      type: [String],
      enum: [
        "electricity",
        "wifi",
        "water supply",
        "parking",
        "security",
        "lift",
        "gym",
        "swimming pool",
      ],
      default: [],
    },
    balcony: { type: Boolean, default: false },
    petsAllowed: { type: Boolean, default: false },
    nonVegAllowed: { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false },
    bachelorAllowed: { type: Boolean, default: false },
    parking: {
      type: String,
      enum: ["None", "Street", "Allocated", "Garage"],
    },
    waterSupply: {
      type: String,
      enum: ["Corporation", "Borewell", "Both"],
    },
    electricityBackup: {
      type: String,
      enum: ["None", "Inverter", "Generator"],
    },
    maintenanceCharges: { type: Number },

    // Rent & Availability
    monthlyRent: {
      type: Number,
      required: true,
      min: [0, "Rent cannot be negative"],
    },
    availableFrom: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          // For new properties, date should not be in the past
          // For existing properties (updates), allow any date
          if (this.isNew) {
            return v >= new Date();
          }
          return true; // Allow any date for updates
        },
        message: "Available date cannot be in the past for new properties",
      },
    },
    
    securityDeposit: {
      type: Number,
      required: true,
      min: [0, "Deposit cannot be negative"],
    },
    rentalDurationMonths: { type: Number },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
propertySchema.index({ city: 1 });
propertySchema.index({ monthlyRent: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ bhkType: 1 });
propertySchema.index({ furnishType: 1 });
propertySchema.index({ popularLocality: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ availableFrom: 1 });

const Property = mongoose.model("Property", propertySchema);

export default Property;