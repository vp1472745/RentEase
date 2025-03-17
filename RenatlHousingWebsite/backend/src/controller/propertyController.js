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
      price,
      images,
      propertyType,
      bhkType,
      area,
      furnishType,
      facilities,
      monthlyRent,
      availableFrom,
      securityDeposit,
      rentalDurationMonths,
    } = req.body;

    const newProperty = new Property({
      title,
      description,
      address,
      city,
      state,
      price,
      images,
      owner: req.user._id, // Assign Owner ID

      // New Fields
      propertyType,
      bhkType,
      area,
      furnishType,
      facilities,
      monthlyRent,
      availableFrom,
      securityDeposit,
      rentalDurationMonths,
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
    const properties = await Property.find().populate("owner", "name email");

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
    const property = await Property.findById(req.params.id).populate("owner", "name email phone");
    if (!property) return res.status(404).json({ message: "Property not found" });

    res.json(property);
  } catch (error) {
    console.error("❌ Get Property by ID Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Search Properties (City & Price Range)
// ✅ Search Properties (City, Address, Price Range, Property Type)
export const searchProperties = async (req, res) => {
  try {
    // Add Cache-Control header to disable caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Disable caching

    const { city, address, minPrice, maxPrice, propertyType } = req.query;

    let query = {}; // Empty Query Object

    // 🔹 Filter for city
    if (city && city.trim() !== "") {
      query.city = { $regex: new RegExp(city, "i") };
    }

    // 🔹 Filter for address
    if (address && address.trim() !== "") {
      query.address = { $regex: new RegExp(address, "i") };
    }

    // 🔹 Filter for price range
    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }

    // 🔹 Filter for Property Type
    if (propertyType && propertyType.trim() !== "") {
      query.propertyType = { $regex: new RegExp(propertyType, "i") }; 
    }

    console.log("🔍 Search Query:", query); // Debugging ke liye ✅

    const properties = await Property.find(query).populate("owner", "name email phone");

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

    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Property Updated Successfully", property: updatedProperty });
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

    await property.remove();
    res.status(200).json({ message: "Property Deleted Successfully" });
  } catch (error) {
    console.error("❌ Delete Property Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
