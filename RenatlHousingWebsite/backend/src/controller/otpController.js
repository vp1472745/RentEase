import sendEmail from "../utils/sendEmail.js";
import sendSms from "../utils/sendSms.js"; // ✅ Twilio से SMS भेजने का फंक्शन इम्पोर्ट करें

const otpStorage = new Map(); // ✅ OTP को अस्थायी रूप से स्टोर करने के लिए

// ✅ Send OTP Controller (Email और Phone दोनों सपोर्ट करेगा)
export const sendOtp = async (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ error: "Email या Phone Number देना जरूरी है!" });
  }

  // 6-digit OTP जनरेट करो
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log("Generated OTP:", otp);

  if (email) {
    // Email पर OTP भेजो
    const emailSent = await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);
    if (!emailSent) {
      return res.status(500).json({ error: "OTP भेजने में समस्या आई (Email)!" });
    }
    otpStorage.set(email, otp); // OTP स्टोर करो
  }

  if (phone) {
    // Phone पर OTP भेजो
    const smsSent = await sendSms(phone, `Your OTP is: ${otp}`);
    if (!smsSent) {
      return res.status(500).json({ error: "OTP भेजने में समस्या आई (Phone)!" });
    }
    otpStorage.set(phone, otp); // OTP स्टोर करो
  }

  res.status(200).json({ message: "OTP सफलतापूर्वक भेज दिया गया!" });
};

// ✅ Verify OTP Controller
export const verifyOtp = (req, res) => {
  const { email, phone, otp } = req.body;

  if ((!email && !phone) || !otp) {
    return res.status(400).json({ error: "Email/Phone और OTP डालना जरूरी है!" });
  }

  const identifier = email || phone; // ✅ Email या Phone में से जो भी हो
  const storedOtp = otpStorage.get(identifier);

  if (storedOtp && storedOtp == otp) {
    otpStorage.delete(identifier); // ✅ OTP हटा दो ताकि दुबारा इस्तेमाल ना हो
    res.status(200).json({ message: "OTP सफलतापूर्वक वेरिफाई हो गया!" });
  } else {
    res.status(400).json({ error: "गलत OTP, कृपया सही OTP डालें!" });
  }
};
