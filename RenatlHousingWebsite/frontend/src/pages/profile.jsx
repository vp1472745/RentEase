import { useState, useEffect, useRef } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaRegFileAlt } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdOutlineKeyboardArrowRight, MdDeleteOutline } from "react-icons/md";
import { IoIosStarOutline } from "react-icons/io";
import news from "../assets/new.png";
import house from "../assets/house.png";
import { BsEye } from 'react-icons/bs';  // For the eye icon
// OR if you prefer another view icon:
import { FiEye } from 'react-icons/fi';  // Alternative eye icon
import { useNavigate, useLocation } from "react-router-dom";
import user from "../assets/users.png";
import { BiHomeSmile } from "react-icons/bi";
import { MdOutlineWatchLater } from "react-icons/md";
import { Heart } from "lucide-react";
import contactp from "../assets/contactp.png";
import seen from "../assets/seen.png";
import axios from "axios";
import { toast } from "react-toastify";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaCamera, FaTrash, FaArrowLeft, FaArrowRight, FaCheck, FaVideo } from "react-icons/fa";
import { BsFillMicFill, BsStopFill } from "react-icons/bs";

const Profile = () => {
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [selectedTab, setSelectedTab] = useState("Contacted");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  const [step, setStep] = useState(1);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideos, setPreviewVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const videoRef = useRef(null);

  const propertyOptions = [
    { display: "Apartment", value: "apartment" },
    { display: "Independent Floor", value: "independent floor" },
    { display: "Independent House", value: "independent house" },
    { display: "Farm House", value: "farm house" },
  ];

  const bhkOptions = [
    { display: "1RK", value: "1RK" },
    { display: "2BHK", value: "2BHK" },
    { display: "3BHK", value: "3BHK" },
    { display: "4+BHK", value: "4+BHK" },
  ];

  const furnishOptions = [
    { display: "Fully Furnished", value: "fully furnished" },
    { display: "Semi Furnished", value: "semi furnished" },
    { display: "Unfurnished", value: "unfurnished" },
  ];

  const facilityOptions = [
    { display: "Electricity", value: "electricity" },
    { display: "WiFi", value: "wifi" },
    { display: "Water Supply", value: "water supply" },
    { display: "Parking", value: "parking" },
    { display: "Security", value: "security" },
    { display: "Lift", value: "lift" },
    { display: "Gym", value: "gym" },
    { display: "Swimming Pool", value: "swimming pool" },
  ];

  const genderOptions = [
    "Couple Friendly",
    "Family",
    "Student",
    "Single",
    "Working professional",
  ];
  const facingDirections = [
    "North",
    "South",
    "East",
    "West",
    "North-East",
    "North-West",
    "South-East",
    "South-West",
  ];

  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    images: [],
    videos: [],
    propertyType: [],
    bhkType: [],
    furnishType: [],
    area: "",
    facilities: [],
    monthlyRent: "",
    availableFrom: "",
    securityDeposit: "",
    rentalDurationMonths: "",
    popularLocality: "",
    ownerphone: "",

    ownerName: "",
    Gender: [],
    coupleFriendly: false,
    floorNumber: "",
    totalFloors: "",
    ageOfProperty: "",
    facingDirection: "",
    maintenanceCharges: "",
    parking: "",
    waterSupply: "",
    electricityBackup: "",
    balcony: false,
    petsAllowed: false,
    nonVegAllowed: false,
    smokingAllowed: false,
    bachelorAllowed: false,
  });

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
  const params = new URLSearchParams(location.search);
  const tabFromURL = params.get("tab");
  const [selectedSection, setSelectedSection] = useState(tabFromURL || "editProfile");

  // Initialize speech recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.log("Speech Recognition not supported in this browser");
      return;
    }

    const speechRecognition = new window.webkitSpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = "en-US";

    speechRecognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      if (transcript) {
        setEditFormData((prev) => ({
          ...prev,
          description: prev.description + " " + transcript,
        }));
      }
    };

    speechRecognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    speechRecognition.onend = () => {
      if (isListening) {
        speechRecognition.start();
      }
    };

    setRecognition(speechRecognition);

    return () => {
      if (speechRecognition) {
        speechRecognition.stop();
      }
    };
  }, [isListening]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  // Video player controls
  const handlePlay = (videoUrl) => {
    const videoElement = document.getElementById(`video-${videoUrl}`);
    if (videoElement) {
      videoElement.play();
    }
  };

  const handlePause = (videoUrl) => {
    const videoElement = document.getElementById(`video-${videoUrl}`);
    if (videoElement) {
      videoElement.pause();
    }
  };

  const handleStop = (videoUrl) => {
    const videoElement = document.getElementById(`video-${videoUrl}`);
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  // Fetch owner's properties
  const fetchOwnerProperties = async () => {
    try {
      setPropertiesLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/properties/owner/my-properties", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data?.properties) {
        setProperties(response.data.properties);
      } else {
        throw new Error(response.data?.message || "No properties found");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to fetch properties");
    } finally {
      setPropertiesLoading(false);
    }
  };

  // Fetch property details for editing
  const fetchPropertyDetails = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setEditingProperty(response.data);
        setEditFormData({
          title: response.data.title,
          description: response.data.description,
          address: response.data.address,
          city: response.data.city,
          state: response.data.state,
          images: response.data.images || [],
          videos: response.data.videos || [],
          propertyType: response.data.propertyType || [],
          bhkType: response.data.bhkType || [],
          furnishType: response.data.furnishType || [],
          area: response.data.area || "",
          facilities: response.data.facilities || [],
          monthlyRent: response.data.monthlyRent || "",
          availableFrom: response.data.availableFrom || "",
          securityDeposit: response.data.securityDeposit || "",
          rentalDurationMonths: response.data.rentalDurationMonths || "",
          popularLocality: response.data.popularLocality || "",
          ownerphone: response.data.ownerphone || "",
     
          ownerName: response.data.ownerName || "",
          Gender: response.data.Gender || [],
          coupleFriendly: response.data.coupleFriendly || false,
          floorNumber: response.data.floorNumber || "",
          totalFloors: response.data.totalFloors || "",
          ageOfProperty: response.data.ageOfProperty || "",
          facingDirection: response.data.facingDirection || "",
          maintenanceCharges: response.data.maintenanceCharges || "",
          parking: response.data.parking || "",
          waterSupply: response.data.waterSupply || "",
          electricityBackup: response.data.electricityBackup || "",
          balcony: response.data.balcony || false,
          petsAllowed: response.data.petsAllowed || false,
          nonVegAllowed: response.data.nonVegAllowed || false,
          smokingAllowed: response.data.smokingAllowed || false,
          bachelorAllowed: response.data.bachelorAllowed || false,
        });
        setPreviewImages(response.data.images?.map(img => img.url) || []);
        setPreviewVideos(response.data.videos?.map(vid => vid.url) || []);
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
      toast.error("Failed to load property details");
    }
  };

  // Handle form input changes
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setEditFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (field, value) => {
    setEditFormData((prevData) => {
      const currentArray = Array.isArray(prevData[field])
        ? prevData[field]
        : [];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return { ...prevData, [field]: updatedArray };
    });

    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!editFormData.title.trim()) errors.title = "Title is required";
      if (!editFormData.description.trim())
        errors.description = "Description is required";
      if (!editFormData.address.trim()) errors.address = "Address is required";
      if (!editFormData.city.trim()) errors.city = "City is required";
      if (!editFormData.state.trim()) errors.state = "State is required";
      if (!editFormData.ownerName.trim())
        errors.ownerName = "Owner name is required";
      if (!editFormData.ownerphone.trim())
        errors.ownerphone = "Phone number is required";
      if (!/^\d{10,15}$/.test(editFormData.ownerphone))
        errors.ownerphone = "Invalid phone number";
      if (editFormData.Gender.length === 0)
        errors.Gender = "At least one tenant preference must be selected";
    }

    if (step === 2) {
      if (!editFormData.area) errors.area = "Area is required";
      if (editFormData.area < 50) errors.area = "Area should be at least 50 sq. ft";
      if (editFormData.propertyType.length === 0)
        errors.propertyType = "Select at least one property type";
      if (editFormData.bhkType.length === 0)
        errors.bhkType = "Select at least one BHK type";
      if (editFormData.furnishType.length === 0)
        errors.furnishType = "Select at least one furnish type";
    }

    if (step === 3) {
      if (!editFormData.monthlyRent)
        errors.monthlyRent = "Monthly rent is required";
      if (!editFormData.securityDeposit)
        errors.securityDeposit = "Security deposit is required";
      if (!editFormData.availableFrom)
        errors.availableFrom = "Available date is required";
      if (new Date(editFormData.availableFrom) < new Date())
        errors.availableFrom = "Date cannot be in the past";
    }

    if (step === 4) {
      if (editFormData.images.length === 0 && editFormData.videos.length === 0)
        errors.media = "At least one image or video is required";
      if (editFormData.images.length > 10)
        errors.images = "Maximum 10 images allowed";
      if (editFormData.videos.length > 3)
        errors.videos = "Maximum 3 videos allowed";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    if (editFormData.images.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    const uploadData = new FormData();
    files.forEach((file) => {
      uploadData.append("images", file);
    });

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/properties/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const newImageUrls = res.data.imageUrls || [];
      setEditFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          ...newImageUrls.map((url) => ({ url, type: "" })),
        ],
      }));
      setPreviewImages((prev) => [...prev, ...newImageUrls]);
    } catch (error) {
      console.error("Image upload failed:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"));
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to upload images. Please try again."
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;
  
    if (editFormData.videos.length + files.length > 3) {
      toast.error("Maximum 3 videos allowed");
      return;
    }
  
    try {
      setUploadingVideos(true);
      setUploadProgress(0);
      
      const uploadedVideos = [];
      for (const file of files) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", "RentEase_Videos");
        
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dkrrpzlbl/video/upload",
          {
            method: "POST",
            body: uploadData,
          }
        );
  
        const data = await response.json();
        if (data.secure_url) {
          uploadedVideos.push({
            url: data.secure_url,
            public_id: data.public_id,
            type: "video"
          });
        }
      }
  
      setEditFormData((prev) => ({
        ...prev,
        videos: [...prev.videos, ...uploadedVideos],
      }));
      setPreviewVideos((prev) => [...prev, ...uploadedVideos.map(v => v.url)]);
    } catch (error) {
      console.error("Video upload failed:", error);
      toast.error("Failed to upload videos. Please try again.");
    } finally {
      setUploadingVideos(false);
      setUploadProgress(0);
    }
  };

  // Submit property updates
  const handlePropertyUpdate = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please login.");
      }

      // Prepare data for submission
      const submitData = {
        ...editFormData,
        propertyType: editFormData.propertyType.map((item) => item.toLowerCase()),
        bhkType: editFormData.bhkType.map((item) => item.toLowerCase()),
        furnishType: editFormData.furnishType.map((item) => item.toLowerCase()),
        facilities: editFormData.facilities.map((item) => item.toLowerCase()),
     
        images: editFormData.images,
        videos: editFormData.videos,
      };

      const response = await axios.put(
        `http://localhost:5000/api/properties/${editingProperty._id}`,
        submitData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Property updated successfully!");
      setEditingProperty(null);
      fetchOwnerProperties();
    } catch (error) {
      console.error("Submission Error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"));
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to update property. Please try again."
        );
      }
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 4) setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const calculateProgress = () => {
    const stepDefinitions = [
      {
        name: "step1",
        fields: [
          "title", "description", "address", "city", "state",
          "ownerName", "ownerphone", "Gender", "popularLocality"
        ],
        weight: 0.2633
      },
      {
        name: "step2",
        fields: [
          "area", "propertyType", "bhkType", "furnishType",
          "floorNumber", "totalFloors", "ageOfProperty", "facingDirection",
        , "balcony", "petsAllowed", "nonVegAllowed",
          "smokingAllowed", "bachelorAllowed"
        ],
        weight: 0.2633
      },
      {
        name: "step3",
        fields: [
          "facilities", "monthlyRent", "securityDeposit",
          "rentalDurationMonths", "maintenanceCharges",
          "availableFrom", "parking", "waterSupply", "electricityBackup"
        ],
        weight: 0.2633
      },
      {
        name: "step4",
        fields: ["images", "videos"],
        weight: 0.30
      }
    ];
  
    let totalProgress = 0;
  
    stepDefinitions.forEach(step => {
      const { fields, weight } = step;
      let filledFields = 0;
  
      fields.forEach(field => {
        const value = editFormData[field];
        
        if (Array.isArray(value)) {
          if (value.length > 0) filledFields++;
        } else if (typeof value === 'string' || typeof value === 'number') {
          if (value.toString().trim() !== '') filledFields++;
        } else if (typeof value === 'object' && value !== null) {
          if (Object.keys(value).length > 0) filledFields++;
        }
      });
  
      const stepCompletion = filledFields / fields.length;
      totalProgress += stepCompletion * weight;
    });
  
    const percentage = Math.round(totalProgress * 100);
    return Math.min(Math.max(percentage, 0), 100);
  };
  const progress = calculateProgress();

  // Handle property edit click
  const handleEditProperty = async (propertyId) => {
    await fetchPropertyDetails(propertyId);
    setStep(1); // Reset to first step when opening edit form
  };

  // Handle property deletion
  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/properties/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Property deleted successfully");
        fetchOwnerProperties();
      } catch (error) {
        console.error("Error deleting property:", error);
        toast.error(error.response?.data?.error || "Failed to delete property");
      }
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
  const handleViewDetails = async (propertyId) => {
    try {
      // Record view in backend if user is authenticated
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`http://localhost:5000/api/properties/${propertyId}/view`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      // Add to local storage for all users
      const seenProperties = JSON.parse(localStorage.getItem('seenProperties') || '[]');
      if (!seenProperties.includes(propertyId)) {
        const updatedSeenProperties = [...seenProperties, propertyId];
        localStorage.setItem('seenProperties', JSON.stringify(updatedSeenProperties));
        
        // Notify Navbar of update
        window.dispatchEvent(new CustomEvent('seenPropertyAdded', {
          detail: { count: updatedSeenProperties.length }
        }));
      }
      
      navigate(`/property/${propertyId}`);
    } catch (error) {
      console.error("Error recording view:", error);
      // Still navigate even if tracking fails
      navigate(`/property/${propertyId}`);
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

  const handleAddProperty = () => {
    navigate("/add-property");
  };

  const renderEditPropertyForm = () => (
    <div className="">
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-10">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Property</h2>
          <button
            onClick={() => setEditingProperty(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {/* Progress Sidebar */}
        <div className="hidden md:block w-full mb-6">
          <div className="flex justify-center">
            <div className="w-32 h-32">
              <CircularProgressbar
                value={progress}
                text={`${Math.round(progress)}%`}
                styles={buildStyles({
                  textColor: "#000000",
                  pathColor: "#6B21A8",
                  trailColor: "#D1D5DB",
                  textSize: "24px text-bold",
                })}
              />
            </div>
          </div>

          <div className="flex justify-between mt-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex flex-col items-center p-2 rounded-lg cursor-pointer ${
                  step === stepNumber
                    ? "bg-purple-200 border-l-4 border-purple-800"
                    : ""
                }`}
                onClick={() => setStep(stepNumber)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber
                      ? "bg-purple-800 text-white text-bold"
                      : "bg-gray-200"
                  }`}
                >
                  {step > stepNumber ? <FaCheck size={14} /> : stepNumber}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-purple-800">
                    {stepNumber === 1 && "Basic Info"}
                    {stepNumber === 2 && "Details"}
                    {stepNumber === 3 && "Facilities"}
                    {stepNumber === 4 && "Media"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handlePropertyUpdate}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 text-bold border-purple-800 outline-none">
              {[
                {
                  field: "title",
                  label: "Property Title",
                  type: "text",
                  required: true,
                },
                {
                  field: "address",
                  label: "Full Address",
                  type: "text",
                  required: true,
                },
                {
                  field: "city",
                  label: "City",
                  type: "text",
                  required: true,
                },
                {
                  field: "state",
                  label: "State",
                  type: "text",
                  required: true,
                },
                {
                  field: "popularLocality",
                  label: "Popular Locality",
                  type: "text",
                },
                {
                  field: "ownerName",
                  label: "Owner Name",
                  type: "text",
                  required: true,
                },
                {
                  field: "ownerphone",
                  label: "Owner Phone",
                  type: "tel",
                  required: true,
                },
              ].map(({ field, label, type, required }) => (
                <div key={field}>
                  <label className="font-bold text-sm text-purple-800 outline-none mb-1">
                    {label}{" "}
                    {required && <span className="text-purple-800">*</span>}
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      name={field}
                      value={editFormData[field]}
                      onChange={handleEditFormChange}
                      className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md focus:ring focus:ring-blue-300 cursor-pointer"
                      required={required}
                      rows={4}
                    />
                  ) : (
                    <input
                      type={type}
                      name={field}
                      value={editFormData[field]}
                      onChange={handleEditFormChange}
                      className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md focus:ring focus:ring-blue-300 cursor-pointer"
                      required={required}
                      minLength={field === "ownerphone" ? 10 : 3}
                      maxLength={field === "ownerphone" ? 15 : undefined}
                    />
                  )}
                  {validationErrors[field] && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors[field]}
                    </p>
                  )}
                </div>
              ))}

              {/* Description with Speech-to-Text */}
              <div>
                <label className="font-bold text-sm text-purple-800 outline-none mb-1">
                  Description <span className="text-purple-800">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                    className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md focus:ring focus:ring-blue-300 cursor-pointer"
                    required
                    rows={4}
                  />
                  <div className="absolute bottom-2 right-2">
                    {isListening ? (
                      <button
                        type="button"
                        onClick={stopListening}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                        title="Stop Recording"
                      >
                        <BsStopFill size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startListening}
                        className="bg-purple-800 text-white p-2 rounded-full hover:bg-purple-700 transition"
                        title="Start Recording"
                      >
                        <BsFillMicFill size={16} />
                      </button>
                    )}
                  </div>
                </div>
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.description}
                  </p>
                )}
                {isListening && (
                  <div className="text-sm text-purple-800 mt-1 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                    Listening... Speak now
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-bold text-purple-800 mb-1">
                    Tenant Preference{" "}
                    <span className="text-purple-800">*</span>
                  </label>
                  {/* Select All checkbox */}
                  <label className="inline-flex items-center cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={
                        editFormData.Gender.length === genderOptions.length
                      }
                      onChange={() => {
                        if (editFormData.Gender.length === genderOptions.length) {
                          setEditFormData((prev) => ({ ...prev, Gender: [] }));
                        } else {
                          setEditFormData((prev) => ({
                            ...prev,
                            Gender: [...genderOptions],
                          }));
                        }
                      }}
                      className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                    />
                    <span className="ml-2 text-sm font-bold text-purple-800">
                      Select All
                    </span>
                  </label>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {genderOptions.map((option) => (
                      <label
                        key={option}
                        className="inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={editFormData.Gender.includes(option)}
                          onChange={() => handleMultiSelect("Gender", option)}
                          className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                        />
                        <span className="ml-2 text-sm text-purple-800">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                  {validationErrors.Gender && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.Gender}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-1">
                  Area (sq. ft) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="area"
                  value={editFormData.area}
                  onChange={handleEditFormChange}
                  className="mt-1 p-3 w-full border border-purple-800 rounded-md outline-none cursor-pointer"
                  required
                  min="50"
                  max="10000"
                />
                {validationErrors.area && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.area}
                  </p>
                )}
              </div>

              {/* Nearby Places Section */}
              {/* <div>
                <label className="block text-sm font-bold text-purple-800 mb-1">
                  Nearby Places
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Hospital",
                    "Mall",
                    "Market",
                    "Railway Station",
                    "Airport",
                    "School",
                  ].map((place) => (
                    <div key={place} className="flex flex-col mb-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`nearby-${place.toLowerCase().replace(" ", "-")}`}
                          checked={editFormData.nearby.some(
                            (item) => item.name === place
                          )}
                          onChange={(e) => {
                            const newNearby = e.target.checked
                              ? [
                                  ...editFormData.nearby,
                                  { name: place, distance: "", unit: "km" },
                                ]
                              : editFormData.nearby.filter(
                                  (item) => item.name !== place
                                );
                            setEditFormData(prev => ({ ...prev, nearby: newNearby }));
                          }}
                          className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800"
                        />
                        <label
                          htmlFor={`nearby-${place.toLowerCase().replace(" ", "-")}`}
                          className="ml-2 text-sm text-purple-800"
                        >
                          {place}
                        </label>
                      </div>

                      {editFormData.nearby.some(
                        (item) => item.name === place
                      ) && (
                        <div className="flex items-center mt-1 ml-6">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={
                              editFormData.nearby.find(
                                (item) => item.name === place
                              )?.distance || ""
                            }
                            onChange={(e) => {
                              const updatedNearby = editFormData.nearby.map(
                                (item) =>
                                  item.name === place
                                    ? { ...item, distance: e.target.value }
                                    : item
                              );
                              setEditFormData(prev => ({
                                ...prev,
                                nearby: updatedNearby,
                              }));
                            }}
                            className="w-16 p-1 border border-purple-300 rounded-md text-sm"
                            placeholder="Distance"
                          />
                          <select
                            value={
                              editFormData.nearby.find(
                                (item) => item.name === place
                              )?.unit || "km"
                            }
                            onChange={(e) => {
                              const updatedNearby = editFormData.nearby.map(
                                (item) =>
                                  item.name === place
                                    ? { ...item, unit: e.target.value }
                                    : item
                              );
                              setEditFormData(prev => ({
                                ...prev,
                                nearby: updatedNearby,
                              }));
                            }}
                            className="ml-2 p-1 border border-purple-300 rounded-md text-sm"
                          >
                            <option value="km">km</option>
                            <option value="m">m</option>
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-purple-800 mb-1">
                    Floor Number
                  </label>
                  <input
                    type="number"
                    name="floorNumber"
                    value={editFormData.floorNumber}
                    onChange={handleEditFormChange}
                    className="mt-1 p-3 w-full border-purple-800 outline-none border rounded-md cursor-pointer"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-800 mb-1">
                    Total Floors
                  </label>
                  <input
                    type="number"
                    name="totalFloors"
                    value={editFormData.totalFloors}
                    onChange={handleEditFormChange}
                    className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md cursor-pointer"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-purple-800 mb-1">
                    Age of Property (years)
                  </label>
                  <input
                    type="number"
                    name="ageOfProperty"
                    value={editFormData.ageOfProperty}
                    onChange={handleEditFormChange}
                    className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md cursor-pointer"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-800 mb-1">
                    Facing Direction
                  </label>
                  <select
                    name="facingDirection"
                    value={editFormData.facingDirection}
                    onChange={handleEditFormChange}
                    className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md text-purple-800 cursor-pointer"
                  >
                    <option value="">Select Direction</option>
                    {facingDirections.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {[
                {
                  label: "Property Type",
                  field: "propertyType",
                  options: propertyOptions,
                  required: true,
                },
                {
                  label: "BHK Type",
                  field: "bhkType",
                  options: bhkOptions,
                  required: true,
                },
                {
                  label: "Furnish Type",
                  field: "furnishType",
                  options: furnishOptions,
                  required: true,
                },
              ].map(({ label, field, options, required }) => (
                <div key={field} className="mt-4">
                  <label className="block text-sm font-bold text-purple-800 mb-1">
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {options.map((option) => (
                      <label
                        key={option.value}
                        className="inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={editFormData[field].includes(option.value)}
                          onChange={() =>
                            handleMultiSelect(field, option.value)
                          }
                          className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                        />
                        <span className="ml-2 text-sm text-purple-800">
                          {option.display}
                        </span>
                      </label>
                    ))}
                  </div>
                  {validationErrors[field] && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors[field]}
                    </p>
                  )}
                </div>
              ))}

              <div className="mt-4">
                <label className="block text-sm font-bold text-purple-800 mb-1">
                  Additional Features
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {[
                    { field: "balcony", label: "Balcony" },
                    { field: "petsAllowed", label: "Pets Allowed" },
                    { field: "nonVegAllowed", label: "Non-Veg Allowed" },
                    { field: "smokingAllowed", label: "Smoking Allowed" },
                    { field: "bachelorAllowed", label: "Bachelor Allowed" },
                  ].map(({ field, label }) => (
                    <label
                      key={field}
                      className="inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={editFormData[field]}
                        onChange={handleEditFormChange}
                        name={field}
                        className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                      />
                      <span className="ml-2 text-sm text-purple-800">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Facilities & Rent */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-1">
                  Facilities
                </label>

                {/* Select All checkbox */}
                <label className="inline-flex items-center cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={
                      editFormData.facilities.length === facilityOptions.length
                    }
                    onChange={() => {
                      if (
                        editFormData.facilities.length === facilityOptions.length
                      ) {
                        setEditFormData((prev) => ({ ...prev, facilities: [] }));
                      } else {
                        setEditFormData((prev) => ({
                          ...prev,
                          facilities: facilityOptions.map(
                            (option) => option.value
                          ),
                        }));
                      }
                    }}
                    className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                  />
                  <span className="ml-2 text-sm font-bold text-purple-800">
                    Select All
                  </span>
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {facilityOptions.map((option) => (
                    <label
                      key={option.value}
                      className="inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={editFormData.facilities.includes(option.value)}
                        onChange={() =>
                          handleMultiSelect("facilities", option.value)
                        }
                        className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                      />
                      <span className="ml-2 text-sm text-purple-800">
                        {option.display}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    field: "monthlyRent",
                    label: "Monthly Rent (₹)",
                    required: true,
                  },
                  {
                    field: "securityDeposit",
                    label: "Security Deposit (₹)",
                    required: true,
                  },
                  {
                    field: "rentalDurationMonths",
                    label: "Minimum Stay (months)",
                  },
                  {
                    field: "maintenanceCharges",
                    label: "Maintenance Charges (₹/month)",
                  },
                ].map(({ field, label, required }) => (
                  <div key={field}>
                    <label className="block text-sm font-bold text-purple-800 mb-1">
                      {label}{" "}
                      {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      name={field}
                      value={editFormData[field]}
                      onChange={handleEditFormChange}
                      className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
                      required={required}
                      min="0"
                      step={field.includes("Rent") ? "1000" : "100"}
                    />
                    {validationErrors[field] && (
                      <p className="mt-1 text-sm text-red-600">
                        {validationErrors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-purple-800 mb-1">
                    Available From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="availableFrom"
                    value={editFormData.availableFrom}
                    onChange={handleEditFormChange}
                    className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {validationErrors.availableFrom && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.availableFrom}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-800 mb-1">
                    Parking
                  </label>
                  <select
                    name="parking"
                    value={editFormData.parking}
                    onChange={handleEditFormChange}
                    className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
                  >
                    <option value="">Select Parking Type</option>
                    <option value="None">None</option>
                    <option value="Street">Street Parking</option>
                    <option value="Allocated">Allocated Parking</option>
                    <option value="Garage">Garage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-purple-800 mb-1">
                    Water Supply
                  </label>
                  <select
                    name="waterSupply"
                    value={editFormData.waterSupply}
                    onChange={handleEditFormChange}
                    className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
                  >
                    <option value="">Select Water Supply</option>
                    <option value="Corporation">Corporation Water</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-800 mb-1">
                    Electricity Backup
                  </label>
                  <select
                    name="electricityBackup"
                    value={editFormData.electricityBackup}
                    onChange={handleEditFormChange}
                    className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
                  >
                    <option value="">Select Backup</option>
                    <option value="None">None</option>
                    <option value="Inverter">Inverter</option>
                    <option value="Generator">Generator</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Upload Media */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Images Section */}
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-1">
                  Upload Images (Max 10)
                </label>

                <div className="relative border-2 border-dashed border-purple-800 rounded-lg p-6 text-center hover:border-purple-600 transition cursor-pointer mb-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <div className="flex flex-col items-center justify-center">
                    <FaCamera className="text-purple-800 text-3xl mb-2" />
                    <p className="text-sm text-purple-800">
                      {uploading
                        ? "Uploading..."
                        : "Click to browse or drag and drop images"}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      JPEG, PNG (Max 5MB each)
                    </p>
                  </div>
                </div>

                {validationErrors.images && (
                  <p className="text-sm text-red-600">
                    {validationErrors.images}
                  </p>
                )}

                {uploading && (
                  <div className="text-purple-800 flex items-center mb-4">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-800"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading images...
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={src}
                        alt="preview"
                        className="w-full h-32 object-cover rounded-md border border-purple-800"
                      />

                      {/* Dropdown for selecting image category */}
                      <select
                        className="w-full mt-2 p-1 border border-purple-800 rounded-md text-sm"
                        value={editFormData.images[index]?.type || ""}
                        onChange={(e) => {
                          const newImages = [...editFormData.images];
                          newImages[index] = {
                            url: src,
                            type: e.target.value,
                          };
                          setEditFormData(prev => ({
                            ...prev,
                            images: newImages,
                          }));
                        }}
                      >
                        <option value=""><i className="fas fa-home"></i> Select Category</option>
                        <option value="bedroom"><i className="fas fa-bed"></i> Bedroom</option>
                        <option value="master-bedroom"><i className="fas fa-crown"></i> Master Bedroom</option>
                        <option value="guest-bedroom"><i className="fas fa-user-friends"></i> Guest Bedroom</option>
                        <option value="kids-bedroom"><i className="fas fa-child"></i> Kids Bedroom</option>
                        <option value="kitchen"><i className="fas fa-utensils"></i> Kitchen</option>
                        <option value="drawing-room"><i className="fas fa-paint-brush"></i> Drawing Room</option>
                        <option value="living-room"><i className="fas fa-couch"></i> Living Room</option>
                        <option value="dining-room"><i className="fas fa-utensils"></i> Dining Room</option>
                        <option value="bathroom"><i className="fas fa-bath"></i> Bathroom</option>
                        <option value="toilet"><i className="fas fa-toilet"></i> Toilet</option>
                        <option value="balcony"><i className="fas fa-leaf"></i> Balcony</option>
                        <option value="study-room"><i className="fas fa-book"></i> Study Room</option>
                        <option value="puja-room"><i className="fas fa-pray"></i> Puja Room</option>
                        <option value="store-room"><i className="fas fa-box-open"></i> Store Room</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                          setEditFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title="Remove image"
                      >
                        <FaTrash size={10} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-purple-800 mt-2">
                  {previewImages.length} of 10 images uploaded
                </div>
              </div>

              {/* Videos Section */}
              <div className="mt-8">
                <label className="block text-sm font-bold text-purple-800 mb-1">
                  Upload Videos (Max 3)
                </label>

                <div className="relative border-2 border-dashed border-purple-800 rounded-lg p-6 text-center hover:border-purple-600 transition cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingVideos}
                  />
                  <div className="flex flex-col items-center justify-center">
                    <FaVideo className="text-purple-800 text-3xl mb-2" />
                    <p className="text-sm text-purple-800">
                      {uploadingVideos
                        ? "Uploading..."
                        : "Click to browse or drag and drop videos"}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      MP4, MOV (Max 500MB each)
                    </p>
                  </div>
                </div>

                {validationErrors.videos && (
                  <p className="text-sm text-red-600">
                    {validationErrors.videos}
                  </p>
                )}

                {uploadingVideos && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-purple-800 mt-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {previewVideos.map((src, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full h-48 bg-gray-100 rounded-md border border-purple-800 overflow-hidden">
                        <video
                          id={`video-${src}`}
                          src={src}
                          controls
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex justify-center space-x-2 mt-2">
                        <button
                          type="button"
                          onClick={() => handlePlay(src)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Play
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePause(src)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Pause
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStop(src)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Stop
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewVideos((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                          setEditFormData(prev => ({
                            ...prev,
                            videos: prev.videos.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title="Remove video"
                      >
                        <FaTrash size={10} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-purple-800 mt-2">
                  {previewVideos.length} of 3 videos uploaded
                </div>
              </div>

              {(validationErrors.media ||
                validationErrors.images ||
                validationErrors.videos) && (
                <p className="text-sm text-red-600 mt-2">
                  {validationErrors.media ||
                    validationErrors.images ||
                    validationErrors.videos}
                </p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t border-purple-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 bg-gray-200 text-purple-800 rounded-md hover:bg-gray-300 transition cursor-pointer"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-700 transition cursor-pointer"
                disabled={Object.keys(validationErrors).length > 0}
              >
                Next
                <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                className={`flex items-center px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-green-700 transition cursor-pointer ${
                  uploading || uploadingVideos
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  uploading ||
                  uploadingVideos ||
                  (editFormData.images.length === 0 &&
                    editFormData.videos.length === 0)
                }
              >
                {uploading || uploadingVideos ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Update Property
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
    </div>
  );

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
          <>
          
<div className="bg-white h-full rounded-md  shadow-lg p-6">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {properties.map((property) => (
        <div
          key={property._id}
          className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="h-48 overflow-hidden">
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[0].url}
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
            <h3 className="font-bold text-lg mb-1"><span>Title :</span>{property.title}</h3>
            <p className="text-gray-600 text-sm mb-2">
              Address: {property.address}, {property.city}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              City: {property.city}
            </p>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-purple-800">
                MonthlyRent ₹{property.monthlyRent?.toLocaleString() || '0'}
              </span>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                {property.propertyType}
              </span>
            </div>
            <div className="flex justify-between mt-4">
            <button
  onClick={() => handleViewDetails(property._id)}
  className="w-30 bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-900 transition  cursor-pointer "
>
  View Details
</button>
              <button
                onClick={() => handleEditProperty(property._id)}
                className="w-20 bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-900 transition flex text-center items-center justify-center  cursor-pointer"
              >
                <CiEdit className="mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDeleteProperty(property._id)}
                className="w-20 bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-900 transition flex text-center items-center justify-center cursor-pointer"
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
</>
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
          <>
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
              {/* <input
                type="tel"
                placeholder="Enter Email"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-b p-2 mt-2 outline-none"
              /> */}
              <button
      onClick={() => navigate("/forgot-password")}
      className="mt-3 px-4 py-2 bg-purple-800 hover:text-black hover:bg-purple-400 font-bold text-white rounded w-[50] cursor-pointer"
    >
      Change Password
    </button>
              {/* <p className="text-gray-500 text-sm mt-2">
                Get OTP on your registered email
              </p> */}
            </div>
          </div>
                        {/* <Link to="/forgot-password" className="mt-3 px-4 py-2 bg-purple-800 hover:text-black hover:bg-purple-400 font-bold text-white rounded w-[50] cursor-pointer" >Change password</Link> */}
</>
        );
    }
  };

  return (
    <>
    <div className="bg-purple-800 w-[100%] h-15 "></div>
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

      {/* Edit Property Modal */}
      {editingProperty && renderEditPropertyForm()}
    </div>
    </>
  );
};

export default Profile;