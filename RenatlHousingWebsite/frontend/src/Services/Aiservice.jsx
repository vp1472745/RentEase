import axios from "axios";

// ✅ Google Gemini API के लिए फंक्शन
export const generatePropertyDescription = async (prompt) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/generate-text", 
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    return response.data.generatedText;
  } catch (error) {
    console.error("AI generation error:", error);
    throw new Error("Failed to generate description. Please try again.");
  }
};