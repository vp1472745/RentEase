import Property from "../models/property.js";

// ✅ Add New Property (Owner Only)
export const addProperty = async (req, res) => {
  try {
    console.log("✅ Property Add Request by:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized, User not found" });
    }

    const {
      title,
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
      title,
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

    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this property" });
    }

    // Handle format conversions for updated fields
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

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ 
      message: "Property Updated Successfully", 
      property: updatedProperty 
    });
  } catch (error) {
    console.error("❌ Update Property Error:", error.message);
    res.status(500).json({ message: "Server Error" });
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