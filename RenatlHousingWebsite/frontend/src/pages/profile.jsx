import { useState, useEffect, useRef } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaRegFileAlt } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdOutlineKeyboardArrowRight, MdDeleteOutline } from "react-icons/md";
import { IoIosStarOutline } from "react-icons/io";
import news from "../assets/new.png";
import house from "../assets/house.png";
import { useNavigate, useLocation } from "react-router-dom";
import user from "../assets/users.png";
import { BiHomeSmile } from "react-icons/bi";
import { MdOutlineWatchLater } from "react-icons/md";
import { Heart } from "lucide-react";
import contactp from "../assets/contactp.png";
import seen from "../assets/seen.png";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [selectedTab, setSelectedTab] = useState("Contacted");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || "https://via.placeholder.com/100"
  );
  const [previewImage, setPreviewImage] = useState(profileImage);
  const [name, setName] = useState(localStorage.getItem("name") || "User Name");
  const [email, setEmail] = useState(localStorage.getItem("email") || "user@example.com");
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

  // Fetch only logged-in owner's properties
  const fetchOwnerProperties = async () => {
    try {
      setPropertiesLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get("http://localhost:5000/api/properties/owner/my-properties", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("API Response:", response); // Add this for debugging
      
      if (response.data && response.data.properties) {
        setProperties(response.data.properties);
      } else {
        throw new Error(response.data?.message || "No properties found");
      }
    } catch (error) {
      console.error("Error fetching owner properties:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "Failed to fetch your properties"
      );
    } finally {
      setPropertiesLoading(false);
    }
  };

  // Sync state when URL changes
  useEffect(() => {
    if (tabFromURL) {
      setSelectedSection(tabFromURL);
    }
  }, [tabFromURL, location]);

  // Fetch properties when section changes to myProperties
  useEffect(() => {
    if (selectedSection === "myProperties") {
      fetchOwnerProperties();
    }
  }, [selectedSection]);

  // Update left profile section when profile data changes
  useEffect(() => {
    setPreviewImage(profileImage);
  }, [profileImage]);

  // Function to change tab and update URL
  const handleTabChange = (tabName) => {
    setSelectedSection(tabName);
    navigate(`/profile?tab=${tabName}`);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const updateProfile = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/profile/update", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Profile update failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const saveProfileDetails = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", tempName);
      formData.append("email", tempEmail);
      formData.append("phone", phone);
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const result = await updateProfile(formData);
      
      // Update local state with new data
      setProfileImage(result.user.profileImage || previewImage);
      setName(result.user.name || tempName);
      setEmail(result.user.email || tempEmail);
      if (result.user.phone) {
        setPhone(result.user.phone);
        localStorage.setItem("phone", result.user.phone);
      }
      
      localStorage.setItem("profileImage", result.user.profileImage || profileImage);
      localStorage.setItem("name", result.user.name || tempName);
      localStorage.setItem("email", result.user.email || tempEmail);
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('profileImage');
    localStorage.removeItem('phone');
    localStorage.removeItem('userId');
    navigate('/login');
    toast.success("Logged out successfully!");
  };

  // Property related functions
  const handleAddProperty = () => {
    navigate("/add-property");
  };

  const handleEditProperty = (propertyId) => {
    navigate(`/edit-property/${propertyId}`);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/properties/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Property deleted successfully");
        // Refresh the properties list after deletion
        fetchOwnerProperties();
      } catch (error) {
        console.error("Error deleting property:", error);
        toast.error(error.response?.data?.error || "Failed to delete property");
      }
    }
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "myTransactions":
        return (
          <div className="border-2 border-purple-800 h-140 rounded p-6">
            <h2 className="text-2xl font-bold mb-5">My Transactions</h2>
            <div className="flex gap-4 flex-wrap">
              {["All", "Premium", "Pay Rent", "Policies", "Rent Agreement"].map((item) => (
                <button 
                  key={item}
                  className="px-4 py-2 rounded-md bg-purple-800 text-white hover:bg-purple-400 hover:text-black"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-8 text-center text-gray-500">
              <p>No transactions found</p>
            </div>
          </div>
        );
      case "myProperties":
        return (
          <div className="bg-white h-full rounded-md border-2 border-purple-800 shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-800">My Properties</h2>
              <button
                onClick={handleAddProperty}
                className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
              >
                Add New Property
              </button>
            </div>

            {propertiesLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-10">
                <BiHomeSmile className="mx-auto text-6xl text-gray-400" />
                <p className="mt-4 text-lg text-gray-600">
                  You haven't listed any properties yet.
                </p>
                <button
                  onClick={handleAddProperty}
                  className="mt-4 bg-purple-800 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
                >
                  List Your First Property
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div
                    key={property._id}
                    className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <BiHomeSmile className="text-4xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{property.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {property.address}, {property.city}
                      </p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-purple-800">
                          ₹{property.monthlyRent?.toLocaleString() || '0'}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {property.propertyType}
                        </span>
                      </div>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => handleEditProperty(property._id)}
                          className="flex items-center text-purple-800 hover:text-purple-600"
                        >
                          <CiEdit className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          className="flex items-center text-red-600 hover:text-red-800"
                        >
                          <MdDeleteOutline className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "myReviews":
        return (
          <div className="bg-white h-140 border-2 border-purple-800 rounded p-6">
            <h2 className="text-2xl font-bold mb-5">My Reviews</h2>
            <div className="text-center text-gray-500 mt-10">
              <p>No reviews found</p>
            </div>
          </div>
        );
      case "myactivity":
        return (
          <div className="bg-white shadow-lg h-140 border-2 border-purple-800 rounded p-6">
            <h2 className="text-2xl font-bold mb-5">My Activity</h2>
            <div className="rounded-lg">
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
                      selectedTab === tab.id
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
              <div className="mt-10 text-center text-gray-500">
                <p>No activity found for selected tab</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6 h-[600px] bg-white shadow-lg w-[700px] ml-5 rounded border-2 border-purple-800">
            <div className="flex gap-4 bg-white p-4 rounded-md">
              <div className="w-[300px]">
                <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
                <h2 className="text-lg font-semibold text-center mb-3">
                  Change Profile Picture
                </h2>
                <div className="mb-2 flex flex-col items-center">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
                    onClick={handleImageClick}
                  />
                  {imageLoading && (
                    <p className="text-purple-800 text-sm mt-1">Uploading image...</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    Click image to upload
                  </p>
                </div>
                <button
                  onClick={saveProfileDetails}
                  disabled={isLoading || imageLoading}
                  className={`mt-3 px-4 py-2 font-bold text-white rounded w-[200px] mx-auto block cursor-pointer ${
                    isLoading || imageLoading 
                      ? "bg-purple-400" 
                      : "bg-purple-800 hover:bg-purple-400 hover:text-black"
                  }`}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <input
                  type="file"
                  id="fileInput"
                  ref={fileInputRef}
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
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full border-b p-2 mt-2 outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="w-full border-b p-2 mt-2 outline-none"
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-md mt-4">
              <h2 className="text-lg font-semibold">Change Password</h2>
              <input
                type="tel"
                placeholder="Enter Email"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-b p-2 mt-2 outline-none"
              />
              <button className="mt-3 px-4 py-2 bg-purple-800 hover:text-black hover:bg-purple-400 font-bold text-white rounded w-[50] cursor-pointer">
                Send OTP
              </button>
              <p className="text-gray-500 text-sm mt-2">
                Get OTP on your registered email
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex bg-white ml-50 rounded-md">
      {/* Left Profile Section */}
      <div className="rounded-md h-[558px] bg-white mt-28 shadow-lg border-purple-800 border-2">
        <div className="w-70 h-[500px] p-6 flex flex-col items-center bg-white ml-5 rounded-md mt-9 mr-5">
          <img
            src={profileImage}
            alt="Profile"
            className="rounded-full w-24 h-24 object-cover border-2 border-gray-300"
          />
          <h2 className="text-lg font-semibold mt-2">{name}</h2>
          <p className="text-gray-500 text-sm">{email}</p>
          {phone && <p className="text-gray-500 text-sm">{phone}</p>}
          
          <nav className="mt-6 w-full">
            <ul className="w-full flex flex-col ml-5">
              <li>
                <button
                  onClick={() => handleTabChange("myactivity")}
                  className={`py-2 flex items-center cursor-pointer w-50 ${
                    selectedSection === "myactivity" ? "text-purple-800 font-bold" : "hover:text-purple-800"
                  }`}
                >
                  <CiEdit className="mr-3" />
                  My Activity
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("editProfile")}
                  className={`py-2 flex items-center cursor-pointer w-50 ${
                    selectedSection === "editProfile" ? "text-purple-800 font-bold" : "hover:text-purple-800"
                  }`}
                >
                  <CiEdit className="mr-3" />
                  Edit Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("myTransactions")}
                  className={`py-2 flex items-center cursor-pointer w-50 ${
                    selectedSection === "myTransactions" ? "text-purple-800 font-bold" : "hover:text-purple-800"
                  }`}
                >
                  <FaRegFileAlt className="mr-3" /> My Transactions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("myProperties")}
                  className={`py-2 flex items-center cursor-pointer w-50 ${
                    selectedSection === "myProperties" ? "text-purple-800 font-bold" : "hover:text-purple-800"
                  }`}
                >
                  <img src={house} className="w-5 h-5 mr-2" alt="" />
                  My Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("myReviews")}
                  className={`py-2 flex items-center cursor-pointer ${
                    selectedSection === "myReviews" ? "text-purple-800 font-bold" : "hover:text-purple-800"
                  }`}
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
      
      {/* Right Content Section */}
      <div className="p-6 overflow-y-auto h-[600px] bg-white w-[800px] ml-5 mt-22">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;