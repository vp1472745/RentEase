import mongoose from "mongoose";

const fraudSchema = new mongoose.Schema({
    name: String,
    contact: String,
    email: String,
    category: String,
    details: String
});

const FraudModel = mongoose.model("FraudReport", fraudSchema);

export default FraudModel;  // ✅ Yeh hona chahiye
