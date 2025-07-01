import Property from "../models/property.js";
import SaveProperty from "../models/SaveProperty.js";
import User from "../models/user.js";
import PropertyView from "../models/viewDetails.js";

// ✅ Add New Property (Owner Only)
export const addProperty = async (req, res) => {
  try {
    console.log("✅ Property Add Request by:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized, User not found" });
    }

    const {
      /* title, */
      description,
      address,
      city,
      state,
      images,
      videos, // Added videos field
      propertyType,
      bhkType,
      area,
      furnishType,
      facilities,
      monthlyRent,
      availableFrom,
      securityDeposit,
      rentalDurationMonths,
      popularLocality,
      ownerphone,
      nearby,
      ownerName,
      Gender,
      // New fields from React form
      floorNumber,
      totalFloors,
      ageOfProperty,
      facingDirection,
      maintenanceCharges,
      parking,
      waterSupply,
      electricityBackup,
      balcony,
      petsAllowed,
      nonVegAllowed,
      smokingAllowed,
      bachelorAllowed
    } = req.body;

    // ✅ Convert bhkType to uppercase, propertyType & furnishType to lowercase
    const formattedBhkType = Array.isArray(bhkType)
      ? bhkType.map(item => item.toUpperCase())
      : [bhkType.toUpperCase()];

    const formattedPropertyType = Array.isArray(propertyType)
      ? propertyType.map(item => item.toLowerCase())
      : [propertyType.toLowerCase()];

    const formattedFurnishType = Array.isArray(furnishType)
      ? furnishType.map(item => item.toLowerCase())
      : [furnishType.toLowerCase()];

    const formattedFacilities = Array.isArray(facilities)
      ? facilities.map(item => item.toLowerCase())
      : [facilities.toLowerCase()];

    const newProperty = new Property({
      /* title, */
      description,
      address,
      city,
      state,
      images,
      videos, // Added videos field
      owner: req.user._id,
      propertyType: formattedPropertyType,
      bhkType: formattedBhkType,
      area,
      furnishType: formattedFurnishType,
      facilities: formattedFacilities,
      monthlyRent,
      availableFrom,
      securityDeposit,
      rentalDurationMonths,
      popularLocality,
      ownerphone,
      ownerName,
      nearby,
      Gender,
      // New fields
      floorNumber,
      totalFloors,
      ageOfProperty,
      facingDirection,
      maintenanceCharges,
      parking,
      waterSupply,
      electricityBackup,
      balcony,
      petsAllowed,
      nonVegAllowed,
      smokingAllowed,
      bachelorAllowed
    });

    await newProperty.save();
    res.status(201).json({ message: "Property Added Successfully", property: newProperty });
  } catch (error) {
    console.error("❌ Add Property Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get All Properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: "No Properties Found" });
    }

    res.status(200).json(properties);
  } catch (error) {
    console.error("❌ Error Fetching Properties:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get Single Property by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("owner", "name email phone");
      
    if (!property) return res.status(404).json({ message: "Property not found" });

    res.json(property);
  } catch (error) {
    console.error("❌ Get Property by ID Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Search Properties with Advanced Filters
export const searchProperties = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    const { 
      city, 
      address, 
      propertyType, 
      bhkType, 
      furnishType, 
      facilities, 
      minRent, 
      maxRent,
      minDeposit,
      maxDeposit,
      rentalDurationMonths, 
      popularLocality,
      // New search filters
      minArea,
      maxArea,
      floorNumber,
      totalFloors,
      ageOfProperty,
      facingDirection,
      parking,
      waterSupply,
      electricityBackup,
      balcony,
      petsAllowed,
      nonVegAllowed,
      smokingAllowed,
      bachelorAllowed
    } = req.query;
    
    let filter = {};
    
    // Basic filters
    if (city) filter.city = new RegExp(city, "i");
    if (propertyType) filter.propertyType = { $in: propertyType.split(",").map(pt => pt.toLowerCase()) };
    if (bhkType) filter.bhkType = { $in: bhkType.split(",").map(bhk => bhk.toUpperCase()) };
    if (furnishType) filter.furnishType = { $in: furnishType.split(",").map(ft => ft.toLowerCase()) };
    
    // Rent range filter
    if (minRent || maxRent) {
      filter.monthlyRent = {};
      if (minRent) filter.monthlyRent.$gte = parseInt(minRent);
      if (maxRent) filter.monthlyRent.$lte = parseInt(maxRent);
    }

    // Deposit range filter
    if (minDeposit || maxDeposit) {
      filter.securityDeposit = {};
      if (minDeposit) filter.securityDeposit.$gte = parseInt(minDeposit);
      if (maxDeposit) filter.securityDeposit.$lte = parseInt(maxDeposit);
    }

    // Area range filter
    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = parseInt(minArea);
      if (maxArea) filter.area.$lte = parseInt(maxArea);
    }

    // Facilities filter
    if (facilities) {
      const facilitiesArray = facilities.split(",").filter(f => f).map(f => f.toLowerCase());
      if (facilitiesArray.length > 0) filter.facilities = { $all: facilitiesArray };
    }

    // Rental duration filter
    if (rentalDurationMonths) {
      filter.rentalDurationMonths = { $lte: parseInt(rentalDurationMonths) };
    }

    // Address search
    if (address) {
      const addressRegex = new RegExp(address.split(",").map(part => part.trim()).join("|"), "i");
      filter.$or = [
        { address: addressRegex },
        { popularLocality: addressRegex },
        { city: addressRegex }
      ];
    }

    // Popular locality search
    if (popularLocality) {
      filter.popularLocality = new RegExp(popularLocality, "i");
    }

    // New property features filters
    if (floorNumber) filter.floorNumber = parseInt(floorNumber);
    if (totalFloors) filter.totalFloors = parseInt(totalFloors);
    if (ageOfProperty) filter.ageOfProperty = parseInt(ageOfProperty);
    if (facingDirection) filter.facingDirection = facingDirection;
    if (parking) filter.parking = parking;
    if (waterSupply) filter.waterSupply = waterSupply;
    if (electricityBackup) filter.electricityBackup = electricityBackup;
    if (balcony) filter.balcony = balcony === 'true';
    if (petsAllowed) filter.petsAllowed = petsAllowed === 'true';
    if (nonVegAllowed) filter.nonVegAllowed = nonVegAllowed === 'true';
    if (smokingAllowed) filter.smokingAllowed = smokingAllowed === 'true';
    if (bachelorAllowed) filter.bachelorAllowed = bachelorAllowed === 'true';

    console.log("🔍 Search Filters:", filter);

    const properties = await Property.find(filter)
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    if (!properties.length) {
      return res.status(404).json({ message: "No Properties Found" });
    }

    res.json(properties);
  } catch (error) {
    console.error("❌ Search Properties Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Property (Owner Only)
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Owner verification
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "Not authorized to update this property" 
      });
    }

    // Validate allowed updates
    const allowedUpdates = [
      'description', 'address', 'city', 'state', 'images', 'videos',
      'propertyType', 'bhkType', 'area', 'furnishType', 'facilities',
      'monthlyRent', 'availableFrom', 'securityDeposit', 'rentalDurationMonths',
      'popularLocality', 'floorNumber', 'totalFloors', 'ageOfProperty',
      'facingDirection', 'maintenanceCharges', 'parking', 'waterSupply',
      'electricityBackup', 'balcony', 'petsAllowed', 'nonVegAllowed',
      'smokingAllowed', 'bachelorAllowed'
    ];

    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ 
        message: "Attempted to update invalid fields" 
      });
    }

    // Remove restricted fields
    const restrictedFields = ['owner', '_id', 'createdAt', '__v'];
    restrictedFields.forEach(field => delete req.body[field]);

    // Handle date formatting for availableFrom
    if (req.body.availableFrom) {
      const dateValue = new Date(req.body.availableFrom);
      if (isNaN(dateValue.getTime())) {
        return res.status(400).json({ 
          message: "Invalid date format for availableFrom" 
        });
      }
      req.body.availableFrom = dateValue;
    }

    // Convert string numbers to actual numbers
    const numericFields = ['monthlyRent', 'securityDeposit', 'maintenanceCharges', 'rentalDurationMonths', 'area', 'floorNumber', 'totalFloors', 'ageOfProperty'];
    numericFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== '') {
        const numValue = Number(req.body[field]);
        if (!isNaN(numValue)) {
          req.body[field] = numValue;
        }
      }
    });

    // Format data before update
    if (req.body.bhkType) {
      req.body.bhkType = Array.isArray(req.body.bhkType)
        ? req.body.bhkType.map(item => item.toUpperCase())
        : [req.body.bhkType.toUpperCase()];
    }

    if (req.body.propertyType) {
      req.body.propertyType = Array.isArray(req.body.propertyType)
        ? req.body.propertyType.map(item => item.toLowerCase())
        : [req.body.propertyType.toLowerCase()];
    }

    if (req.body.furnishType) {
      req.body.furnishType = Array.isArray(req.body.furnishType)
        ? req.body.furnishType.map(item => item.toLowerCase())
        : [req.body.furnishType.toLowerCase()];
    }

    if (req.body.facilities) {
      req.body.facilities = Array.isArray(req.body.facilities)
        ? req.body.facilities.map(item => item.toLowerCase())
        : [req.body.facilities.toLowerCase()];
    }

    // Handle images and videos - ensure they have the correct structure
    if (req.body.images) {
      req.body.images = req.body.images.map(img => {
        if (typeof img === 'string') {
          return { url: img, type: 'image' };
        }
        return {
          url: img.url,
          type: img.type || 'image',
          public_id: img.public_id
        };
      });
    }

    if (req.body.videos) {
      req.body.videos = req.body.videos.map(vid => {
        if (typeof vid === 'string') {
          return { url: vid, type: 'video' };
        }
        return {
          url: vid.url,
          type: vid.type || 'video',
          public_id: vid.public_id
        };
      });
    }

    console.log('🔧 Processed update data:', req.body);

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true,
      message: "Property updated successfully",
      property: updatedProperty 
    });

  } catch (error) {
    console.error("Update Property Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update property",
      error: error.message 
    });
  }
};

// ✅ Delete Property (Owner Only)
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this property" });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Property Deleted Successfully" });
  } catch (error) {
    console.error("❌ Delete Property Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


// ✅ Get All Properties of Logged-in Owner
// ✅ Get Properties of Logged-in Owner
export const getOwnerProperties = async (req, res) => {
  try {
    console.log("Fetching properties for owner:", req.user._id);
    
    const properties = await Property.find({ owner: req.user._id })
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    if (!properties || properties.length === 0) {
      return res.status(200).json({ 
        success: true,
        properties: [],
        message: "No properties found for this owner" 
      });
    }

    res.status(200).json({ 
      success: true,
      properties 
    });
  } catch (error) {
    console.error("Error fetching owner properties:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch owner properties",
      error: error.message 
    });
  }
};



// Record a property view (increment view count)
// Endpoint example: POST /api/properties/:id/view
export const recordPropertyView = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user?._id;

    // Update view count
    await Property.findByIdAndUpdate(propertyId, { $inc: { viewCount: 1 } });

    // Log view details if user is authenticated
    if (userId) {
      await PropertyView.create({
        property: propertyId,
        user: userId,
        viewedAt: new Date()
      });
    }

    res.status(200).json({ message: "View recorded successfully" });
  } catch (error) {
    console.error("❌ Record View Error:", error);
    res.status(500).json({ message: "Failed to record view" });
  }
};

// ✅ Save Property
export const saveProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if already saved
    const existingSave = await SaveProperty.findOne({ user: userId, property: propertyId });
    if (existingSave) {
      return res.status(200).json({ 
        success: true,
        message: "Property already saved",
        alreadySaved: true
      });
    }

    // Save property
    const savedProperty = new SaveProperty({
      user: userId,
      property: propertyId
    });

    await savedProperty.save();

    // Update user's savedProperties array
    await User.findByIdAndUpdate(userId, {
      $addToSet: { savedProperties: propertyId }
    });

    res.status(201).json({ 
      success: true, 
      message: "Property saved successfully" 
    });
  } catch (error) {
    console.error("❌ Error saving property:", error);
    res.status(500).json({ 
      message: "Failed to save property",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ Unsave Property
export const unsaveProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;
    
    // Remove from SaveProperty collection
    const result = await SaveProperty.findOneAndDelete({ 
      user: userId, 
      property: propertyId 
    });

    if (!result) {
      return res.status(404).json({ message: "Saved property not found" });
    }

    // Remove from user's savedProperties array
    await User.findByIdAndUpdate(userId, {
      $pull: { savedProperties: propertyId }
    });

    res.status(200).json({ 
      success: true, 
      message: "Property unsaved successfully" 
    });
  } catch (error) {
    console.error("❌ Error unsaving property:", error);
    res.status(500).json({ 
      message: "Failed to unsave property",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ Get User's Saved Properties
export const getSavedProperties = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("🔍 Fetching saved properties for user:", userId);
    
    // Get saved properties with populated property details
    const savedProperties = await SaveProperty.find({ user: userId })
      .populate({
        path: 'property',
        select: '-__v',
        populate: {
          path: 'owner',
          select: 'name email phone'
        }
      })
      .sort({ savedAt: -1 });

    console.log("📦 Found saved properties:", savedProperties.length);

    // Extract property data
    const properties = savedProperties
      .map(sp => sp.property)
      .filter(Boolean); // Remove any null properties

    console.log("✅ Returning properties:", properties.length);
    res.json(properties);
  } catch (error) {
    console.error("❌ Error fetching saved properties:", error);
    console.error("❌ Error details:", {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id
    });
    res.status(500).json({ 
      message: "Failed to fetch saved properties",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ Check if property is saved by user
export const checkSavedProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;
    
    const savedProperty = await SaveProperty.findOne({ 
      user: userId, 
      property: propertyId 
    });

    res.json({ 
      isSaved: !!savedProperty 
    });
  } catch (error) {
    console.error("❌ Error checking saved property:", error);
    res.status(500).json({ 
      message: "Failed to check saved property",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
