import { useState, useEffect } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaRegFileAlt } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoIosStarOutline } from "react-icons/io";
import news from "../assets/new.png";
import house from "../assets/house.png";
import { useNavigate, useLocation } from "react-router-dom";
import user from "../assets/users.png"
import hotel from "../assets/hotel.jpg"
import { BiHomeSmile } from "react-icons/bi";
import { MdOutlineWatchLater } from "react-icons/md";
import { Heart } from "lucide-react"; // Lucide-react icon library
import contactp from "../assets/contactp.png"; // Contacted Properties Icon
import seen from "../assets/seen.png"; // Seen Properties Icon

const Profile = () => {
  const [phone, setPhone] = useState("");
  const [selectedTab, setSelectedTab] = useState("Contacted");

  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/100"
  );
  const [previewImage, setPreviewImage] = useState(profileImage);
  const [name, setName] = useState("User Name");
  const [email, setEmail] = useState("user@example.com");
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);

  const location = useLocation();
  const navigate = useNavigate();

  // Get tab from URL
  const params = new URLSearchParams(location.search);
  const tabFromURL = params.get("tab");

  const [selectedSection, setSelectedSection] = useState(
    tabFromURL || "editProfile"
  );

  // Sync state when URL changes
  useEffect(() => {
    if (tabFromURL) {
      setSelectedSection(tabFromURL);
    }
  }, [tabFromURL]);

  // Function to change tab and update URL
  const handleTabChange = (tabName) => {
    setSelectedSection(tabName);
    navigate(`/profile?tab=${tabName}`);
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
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "myTransactions":
        return (
          <>
          <div
          //       className="absolute inset-0 bg-cover bg-center h-20z"
          //       style={{
          //         backgroundImage: `url(${hotel})`,
          //         filter: "brightness(50%)", // Adjust opacity (alternative method)
          //       }}
          //     ></div>
          //  <div
                className="absolute inset-0 bg-cover bg-center h-20 "
                style={{
                  backgroundImage: `url(${hotel})`,
                  filter: "brightness(50%)", // Adjust opacity (alternative method)
                }}
              ></div>
            <h2 className="text-2xl font-bold mt-5 ">My Transactions</h2>
            <div className="flex gap-4 mt-5 ">
              <button className="px-4 py-2 rounded-md w-30 bg-purple-800 text-white hover:bg-purple-400 hover:text-black cursor-pointer">
                All
              </button>
              <button className="px-4 py-2 w-30 bg-purple-800 text-white hover:bg-purple-400 hover:text-black rounded-md cursor-pointer">
                Premium
              </button>
              <button className="px-4 py-2 bg-purple-800 text-white hover:bg-purple-400 hover:text-black rounded-md cursor-pointer">
                Pay Rent
              </button>
              <button className="px-4 py-2 bg-purple-800 text-white hover:bg-purple-400 hover:text-black rounded-md cursor-pointer">
                Policies
              </button>
              <button className="px-4 py-2 bg-purple-800 text-white hover:bg-purple-400 hover:text-black rounded-md cursor-pointer">
                Rent Agreement
              </button>
            </div>
          </>
        );
      case "myProperties":
        return (<>
        <div className="bg-purple-100 h-140 rounded-md">
         <div
            className="absolute inset-0 bg-cover bg-center h-20"
            style={{
              backgroundImage: `url(${hotel})`,
              filter: "brightness(50%)", // Adjust opacity (alternative method)
            }}
          ></div>

        <h2 className="text-2xl font-bold  ml-5">My Properties</h2>
        </div>
        </>);
      case "myReviews":
        return (<>
        <div className="bg-purple-100 h-140">
         <div
            className="absolute inset-0 bg-cover bg-center h-20"
            style={{
              backgroundImage: `url(${hotel})`,
              filter: "brightness(50%)", // Adjust opacity (alternative method)
            }}
          ></div>
        <h2 className="text-2xl font-bold bg-purple-100 ">My Reviews</h2>
        </div>
        </>);

        case "myactivity":
          return (
            <>   
            <div className="bg-purple-50 h-140">      <div
            className="absolute inset-0 bg-cover bg-center h-20"
            style={{
              backgroundImage: `url(${hotel})`,
              filter: "brightness(50%)", // Adjust opacity (alternative method)
            }}
          ></div>
          <h2 className="text-2xl font-bold ">My Activity</h2>
          {/* ✅ Updated My Activity Section */}
<div className=" p-4 rounded-lg">
 
  <div className="flex gap-15 overflow-x-auto pb-2 no-scrollbar text-[12px]">
    {[
      {
        id: "Contacted",
        label: "Contacted\nProperties",
        icon: <img src={contactp} alt="Contacted" className="w-7 h-7 mt-2" />,
        count: 4,
      },
      {
        id: "Seen",
        label: "Seen\nProperties",
        icon: <img src={seen} alt="Seen" className="w-7 h-7 mt-2" />,
        count: 0,
      },
      {
        id: "Saved",
        label: "Saved\nProperties",
        icon: <Heart size={23} className="mt-2" />,
        count: 0,
      },
      {
        id: "Recent",
        label: "Recent\nSearches",
        icon: <MdOutlineWatchLater size={23} className="mt-2" />,
        count: 0,
      },
    ].map((tab) => (
      <div
        key={tab.id}
        className={`flex flex-col items-center border-2 rounded-lg px-6 shadow-md w-[72px] h-[90px] relative cursor-pointer ${
          selectedTab === tab.iduser
            ? "bg-purple-50 border-purple-800 border-2 text-purple-800 hover:text-black"
            : "bg-white shadow-lg hover:border-purple-800 border-3"
        }`}
        onClick={() => setSelectedTab(tab.id)}
      >
        {tab.icon}
        <p className="text-center whitespace-pre-line">{tab.label}</p>
        <div
          className={`px-3 rounded-full text-sm mb-2 ${
            selectedTab === tab.id
              ? "bg-purple-50 text-purple-800"
              : "bg-gray-200 text-purple-800"
          }`}
        >
          {tab.count.toString().padStart(2, "0")}
        </div>
        {selectedTab === tab.id && (
          <div className="absolute bottom-[-6px] w-3 h-3 bg-purple-50 border-b-2 border-purple-800 rotate-45"></div>
        )}
      </div>
    ))}
  </div>
  </div>
</div>

          </>
);
      default:
        return (
          <>
           <div className="">
          <div>
            <div
                className="absolute inset-0 bg-cover bg-center h-20"
                style={{
                  backgroundImage: `url(${hotel})`,
                  filter: "brightness(50%)", // Adjust opacity (alternative method)
                }}
              ></div>
          
            <div className="p-6  h-[720px] bg-purple-100 shadow-lg  w-[700px]  ml-5    rounded-md">
              <div className="flex gap-4  bg-white p-4 rounded-md  border-2 border-purple-800  shadow-lg ">
                <div className="w-[300px] ">
                  <h2 className="text-lg font-semibold text-center mb-3">
                    <h1 className="text-2xl font-bold mb-4 ">Edit Profile</h1>
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
                      <p className="text-gray-500 text-sm">
                        Click image to upload
                      </p>
                    </div>
                  )}
                  <button
                    onClick={saveProfileDetails}
                    className="mt-3 px-4 py-2 bg-purple-800 hover:bg-purple-400 font-bold hover:text-black text-white rounded w-[200px] mx-auto block cursor-pointer"
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
                    className="w-full border-b p-2 mt-2 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="w-full border-b p-2 mt-2 outline-none"
                  />
                </div>
              </div>

              <div className="bg-white p-4 rounded-md shadow-lg mt-4 border-2 border-purple-800">
                <h2 className="text-lg font-semibold">Change Number</h2>
                <input
                  type="tel"
                  placeholder="Enter Number "
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-b p-2 mt-2 rounded"
                />
                <button className="mt-3 px-4 py-2 bg-purple-800 font-bold hover:bg-purple-400  hover:text-black text-white rounded w-[50] cursor-pointer">
                  Save
                </button>
                {/* <p className="text-gray-500 text-sm mt-2">Get OTP on your registered email</p> */}
              </div>

              <div className="bg-white p-4 rounded-md shadow-lg mt-4 border-2 border-purple-800">
                <h2 className="text-lg font-semibold">Change Password</h2>
                <input
                  type="tel"
                  placeholder="Enter Email "
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-b p-2 mt-2 rounded outline-none"
                />
                <button className="mt-3 px-4 py-2 bg-purple-800  hover:text-black hover:bg-purple-400 font-bold text-white rounded w-[50] cursor-pointer">
                  Send OTP
                </button>
                <p className="text-gray-500 text-sm mt-2">
                  Get OTP on your registered email
                </p>
              </div>
            </div>
            </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex  bg-white    ml-50 rounded-md">
      <div className=" rounded-md h-[600px] bg-purple-100 mt-28  shadow-lg">
      <div className="w-70 shadow-lg h-[550px] p-6 flex flex-col items-center border-purple-800 border-2 bg-white  ml-5 rounded-md mt-9 mr-5">
        <img
          src={profileImage}
          alt="Profile"
          className="rounded-full w-24 h-24 object-cover border-2 border-gray-300"
        />
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-gray-500 text-sm">{email}</p>
        <nav className="mt-6 w-full">
          <ul className="w-full flex flex-col ml-5">
          <li>
              <button
                onClick={() => handleTabChange("myactivity")}
                className="py-2 hover:text-purple-800 flex items-center  cursor-pointer  w-50"
              >
                <CiEdit className="mr-3" />
                My Acitivity
              </button>
            </li>
            
            <li>
              <button
                onClick={() => handleTabChange("editProfile")}
                className="py-2 hover:text-purple-800 flex items-center  cursor-pointer  w-50"
              >
                <CiEdit className="mr-3" />
                Edit Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("myTransactions")}
                className="py-2 hover:text-purple-800 flex items-center  cursor-pointer  w-50"
              >
                <FaRegFileAlt className="mr-3" /> My Transactions
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("myProperties")}
                className="py-2 hover:text-purple-800 flex items-center  cursor-pointer  w-50"
              >
                <img src={house} className="w-5 h-5 mr-2 " alt="" />
                My Properties
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("myReviews")}
                className="py-2 hover:text-purple-800 flex items-center cursor-pointer"
              >
                <IoIosStarOutline className="mr-2" /> My Reviews{" "}
                <img src={news} className="w-10 h-10 ml-18" alt="" />
              </button>
            </li>
            <li className="mt-4 border-t pt-3">
              <button
                onClick={handleLogout}
                className="py-2 text-red-600 hover:text-red-800 flex items-center cursor-pointer"
              >
                
                <RiLogoutCircleRLine className="mr-3" /> Logout
              </button>
            </li>
          </ul>
        </nav>
        </div>
      </div>

      <div className="p-6 overflow-y-auto h-[600px] bg-white w-[800px] ml-5 mt-22">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;
