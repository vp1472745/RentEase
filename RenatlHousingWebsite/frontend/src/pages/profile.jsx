import { useState } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri"; // Move this import statement to the top
// import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import arrrow from "../assets/rightarrow.png";
import news from "../assets/new.png"
import { CiEdit } from "react-icons/ci";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoIosStarOutline } from "react-icons/io";

const Profile = () => {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/100"
  );
  const [previewImage, setPreviewImage] = useState(profileImage);
  const [name, setName] = useState("User Name");
  const [email, setEmail] = useState("user@example.com");
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);

  const sendOtp = () => {
    if (phone.length === 10) {
      setOtpSent(true);
      alert("OTP Sent Successfully!");
    } else {
      alert("Enter a valid 10-digit phone number.");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const saveProfileDetails = () => {
    setProfileImage(previewImage);
    setName(tempName);
    setEmail(tempEmail);
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
    // You can add logic to clear session, redirect, etc.
  };

  return (
    <div className="flex bg-white mt-20">
      {/* Left Sidebar (Sticky) */}
      <div className="w-1/4 bg-white shadow-lg h-screen sticky top-0 p-6 flex flex-col items-center">
        <img
          src={profileImage}
          alt="Profile"
          className="rounded-full mb-4 w-24 h-24 object-cover border-2 border-gray-300"
        />
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-gray-500 text-sm">{email}</p>

        <div className="shadow border mt-10 w-[220px] flex flex-col items-center bg-gray-200 rounded-md h-80">
          <nav className="mt-6 w-full">
            <ul className="w-full flex flex-col items-center">
            <li className="w-full ">
              <div className="flex">
              
                <button className="py-1 hover:bg-gray-200 ml-3 ">My Activites</button>
                <MdOutlineKeyboardArrowRight className="ml-20 mt-2"  size={30}/>
                </div>
              </li>
              <hr className="w-full" />
              
              <li className="w-full ">
              <div className="flex">
              <FaRegFileAlt className="mt-3"/>
                <button className="py-2 hover:bg-gray-200 px-4 ">My Transactions</button>
                </div>
              </li>
              
              <li className="w-full ">
              <div className="flex">
              <IoIosStarOutline className="mt-3" />
                <button className="py-2 hover:bg-gray-200 px-4 ">My Properties</button>
                </div>
              </li>
              <hr className="w-full" />
              <li className="w-full ">
              <div className="flex">
              <CiEdit className="mt-3"/>
                <button className="py-2 hover:bg-gray-200 px-4 ">My Review</button>
                <img src={news} className="w-10 h-10 ml-10" alt="" />
                </div>
              </li>
            </ul>
          </nav>

          <div className="flex bg-white rounded-md border mt-6 w-50 h-10 cursor-pointer" onClick={handleLogout}>
            <RiLogoutCircleRLine
              className="mt-2 mb-5 ml-5 cursor-pointer"
              size={22}
        // Added onClick here for the icon
            />
            <button
              className="text-black text-center text-[20px] ml-5 cursor-pointer"
             // Added onClick here for the button
            >
              Log Out
            </button>
            <MdOutlineKeyboardArrowRight className="ml-5 mt-1 cursor-pointer" size={35}  />          </div>
        </div>
      </div>

      {/* Right Side - Scrollable Content */}
      <div className="p-6 overflow-y-auto h-screen w-[600px]">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <div className="flex gap-4 mb-4 bg-white p-4 rounded">
          <div className="w-[300px]">
            <h2 className="text-lg font-semibold text-center mb-3">
              Change Profile Picture
            </h2>
            {previewImage && (
              <div className="mb-2 flex flex-col items-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
                  onClick={handleImageClick}
                />
                <p className="text-gray-500 text-sm">Click image to upload</p>
              </div>
            )}
            <button
              onClick={saveProfileDetails}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded w-[200px] mx-auto block"
            >
              Save Changes
            </button>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="w-1/2">
            <h2 className="text-lg font-semibold">Profile Info</h2>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setTempName(e.target.value)}
              className="w-full border-b p-2 mt-2"
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setTempEmail(e.target.value)}
              className="w-full border-b p-2 mt-2"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow mt-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <input
            type="tel"
            placeholder="Enter Email "
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border-b p-2 mt-2 rounded"
          />
          <button className="mt-3 px-4 py-2 bg-purple-500 text-white rounded w-[50]">
            Send OTP
          </button>
          <p className="text-gray-500 text-sm mt-2">Get OTP on your registered email</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
