import Property from "../models/property.js";

// ✅ Add New Property (Owner Only)
export const addProperty = async (req, res) => {
  try {
    console.log("✅ Property Add Request by:", req.user); // Debugging Log

    // ❌ Check if req.user is undefined
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized, User not found" });
    }

    const { title, description, address, city, state, price, images } = req.body;

    // ✅ New Property Create करो और `owner` Assign करो
    const newProperty = new Property({
      title,
      description,
      address,
      city,
      state,
      price,
      images,
      owner: req.user._id, // ✅ Assign Owner ID
    });

    await newProperty.save();
    res.status(201).json({ message: "Property Added Successfully", property: newProperty });

  } catch (error) {
    console.error("❌ Add Property Error:", error);
    res.status(400).json({ message: error.message });
  }
};


// ✅ Get All Properties (Available Only)
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("owner", "name email"); // ✅ Owner की Details भी Fetch करो

    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: "No Properties Found" });
    }

    console.log("✅ Properties Fetched Successfully:", properties); // Debugging Log

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
export const searchProperties = async (req, res) => {
  try {
    const { city, address, minPrice, maxPrice } = req.query;

    let query = {}; // Empty Query Object

    // ✅ Check city before adding regex
    if (city && city.trim() !== "") {
      query.city = { $regex: new RegExp(city, "i") };
    }

    // ✅ Check address before adding regex
    if (address && address.trim() !== "") {
      query.address = { $regex: new RegExp(address, "i") };
    }

    // ✅ Add price range filters
    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }

    console.log("🔍 Final MongoDB Query:", JSON.stringify(query, null, 2)); // Debugging Log

    // ✅ Fetch properties from database
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



// yaha property ko add get or search krne liye y file create kiya gya hai