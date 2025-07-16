import { useState } from 'react';
import P from "../../assets/phone.png";
import Footer from "../../component/footerPage/footer.jsx";

const HousingApp = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendLink = () => {
    setIsSent(false);
    setError('');
  
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
  
    if (!cleanedNumber || cleanedNumber.length < 10) {
      setError('Please enter a valid phone number with country code');
      return;
    }
  
    const rawMessage = ` *RoomMilega* – India's Premier Rental Platform

 *Coming Soon!* 

We're excited to announce that RoomMilega official mobile app is launching soon! 

✨ *What's Coming:*
• Seamless Rent Payments via Credit Card
• 100% Secure & Instant Transactions
• Zero Convenience Fees
• Property Management Made Easy
• Real-time Notifications
• 24/7 Customer Support

📱 *Get Early Access:*
Stay tuned for the official launch! We'll notify you as soon as the app is available for download.

🎯 *Why RoomMilega?*
• Trusted by 10,000+ users
• Industry-leading security
• Award-winning customer service
• Made in India, for India

*RoomMilega* – Where Smart Living Begins!

For more information, visit: www.roommilega.in

*This is an automated message from RoomMilega*`;
  
    const encodedMessage = encodeURIComponent(rawMessage);
  
    window.open(`https://wa.me/${cleanedNumber}?text=${encodedMessage}`, '_blank');
    setIsSent(true);
  };

  return (
    <>
      <div className='h-19 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md mt-1 font-mono'></div>
      
      <div className='flex flex-col lg:flex-row mx-auto justify-center items-center bg-gray-100 min-h-[80vh] py-10 px-4'>
        {/* Form Section */}
        <div className="w-full max-w-md bg-gray-100 p-6 lg:mt-0">
          <div className="">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">RoomMilega on the Go!</h1>
            <p className="text-gray-600 mb-2 text-sm">Our official mobile app is coming soon!</p>
            <p className="text-gray-500 mb-4 text-sm">Get notified when we launch.</p>

            <div className="my-4">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number with country code (e.g. +91XXXXXXXXXX)"
                className=" px-4 w-70 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-800"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <button
              onClick={handleSendLink}
              disabled={!phoneNumber.trim()}
              className={`w-70 py-3 px-4 rounded-lg font-medium ${
                phoneNumber.trim()
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              {isSent ? 'Message Sent!' : 'Send Coming Soon Message'}
            </button>

            <div className="mt-8 flex  space-x-4">
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="App Store"
                  className="h-10"
                />
              </a>
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-10"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className='mt-10 lg:mt-0 lg:ml-10 flex justify-center'>
          <img src={P} alt="'Room Milega' App" className='w-64 md:w-80' />
        </div>
      </div>
    
      
      <Footer/>
    </>
  );
};

export default HousingApp;