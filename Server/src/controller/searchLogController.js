import SearchLog from "../models/searchLog.js";

export const saveSearchLog = async (req, res) => {
  try {
    const { searchTerm, device } = req.body;
    const userId = req.user?._id;
    const name = req.user?.name;
    const email = req.user?.email;
    const role = req.user?.role;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (role !== 'tenant' && role !== 'owner') {
      return res.status(403).json({ success: false, message: "Only tenants and owners can save search logs." });
    }
    const log = new SearchLog({
      userId,
      name: name || "Guest",
      email: email || "Guest",
      role: role || "guest",
      searchTerm: searchTerm || "",
      device: device || "Unknown Device",
    });
    await log.save();
    res.status(201).json({ success: true, message: "Search log saved" });
  } catch (error) {
    console.error("Error saving search log:", error);
    res.status(500).json({ success: false, message: "Failed to save search log" });
  }
}; 