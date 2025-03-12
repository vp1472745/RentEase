import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config(); // ✅ यह सुनिश्चित करता है कि .env वैल्यू सही से लोड हो

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSms = async (to, message) => {
  try {
    if (!process.env.TWILIO_SID.startsWith("AC")) {
      throw new Error("Invalid TWILIO_SID! It must start with 'AC'.");
    }

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log(`✅ OTP sent to Phone: ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
    return false;
  }
};

export default sendSms;
