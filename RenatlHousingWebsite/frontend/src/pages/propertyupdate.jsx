import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaCamera, FaTrash, FaArrowLeft, FaArrowRight, FaCheck, FaVideo, FaPlus, FaMinus } from "react-icons/fa";
import { BsFillMicFill, BsStopFill } from "react-icons/bs";

const PropertyUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
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
    nearby: [],
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

  const [newNearby, setNewNearby] = useState({
    name: "",
    distance: "",
    unit: "km"
  });

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

  const nearbyOptions = [
    "Hospital",
    "Market",
    "Airport",
    "Mall",
    "Railway Station",
    "School"
  ];
  
  const facingDirections = [
    "North", "South", "East", "West",
    "North-East", "North-West", "South-East", "South-West"
  ];

  const distanceUnits = ["km", "m"];

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const property = response.data;
        
        console.log("Property data received:", property);
        console.log("AvailableFrom raw value:", property.availableFrom);
        
        // Format dates for date inputs
        let availableFrom = "";
        if (property.availableFrom) {
          try {
            const date = new Date(property.availableFrom);
            if (!isNaN(date.getTime())) {
              availableFrom = date.toISOString().split('T')[0];
            } else {
              console.warn("Invalid date format for availableFrom:", property.availableFrom);
            }
          } catch (error) {
            console.error("Error parsing availableFrom date:", error);
          }
        }

        // Ensure nearby places is an array and has proper structure
        const nearbyPlaces = Array.isArray(property.nearby) 
          ? property.nearby.map(item => ({
              name: item.name || "",
              distance: item.distance || "",
              unit: item.unit || "km"
            }))
          : [];

        // Ensure all array fields are properly initialized
        const arrayFields = [
          'propertyType', 'bhkType', 'furnishType', 'facilities', 'Gender', 'nearby'
        ];
        
        arrayFields.forEach(field => {
          if (!Array.isArray(property[field])) {
            property[field] = [];
          }
        });

        setFormData({
          description: property.description || "",
          address: property.address || "",
          city: property.city || "",
          state: property.state || "",
          images: (property.images || []).filter(img => 
            img.url && img.url.includes('cloudinary.com')
          ),
          videos: (property.videos || []).filter(vid => 
            vid.url && vid.url.includes('cloudinary.com')
          ),
          propertyType: property.propertyType || [],
          bhkType: property.bhkType || [],
          furnishType: property.furnishType || [],
          area: property.area || "",
          facilities: property.facilities || [],
          monthlyRent: property.monthlyRent || "",
          availableFrom: availableFrom,
          securityDeposit: property.securityDeposit || "",
          rentalDurationMonths: property.rentalDurationMonths || "",
          popularLocality: property.popularLocality || "",
          ownerphone: property.ownerphone || "",
          nearby: nearbyPlaces,
          ownerName: property.ownerName || "",
          Gender: property.Gender || [],
          coupleFriendly: property.coupleFriendly || false,
          floorNumber: property.floorNumber || "",
          totalFloors: property.totalFloors || "",
          ageOfProperty: property.ageOfProperty || "",
          facingDirection: property.facingDirection || "",
          maintenanceCharges: property.maintenanceCharges || "",
          parking: property.parking || "",
          waterSupply: property.waterSupply || "",
          electricityBackup: property.electricityBackup || "",
          balcony: property.balcony || false,
          petsAllowed: property.petsAllowed || false,
          nonVegAllowed: property.nonVegAllowed || false,
          smokingAllowed: property.smokingAllowed || false,
          bachelorAllowed: property.bachelorAllowed || false,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property data");
        navigate("/my-properties");
      }
    };

    fetchProperty();
  }, [id, navigate]);

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
        setFormData(prev => ({
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

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.description.trim()) errors.description = "Description is required";
      if (!formData.address.trim()) errors.address = "Address is required";
      if (!formData.city.trim()) errors.city = "City is required";
      if (!formData.state.trim()) errors.state = "State is required";
      if (!formData.ownerName.trim()) errors.ownerName = "Owner name is required";
      if (!formData.ownerphone.trim()) errors.ownerphone = "Phone number is required";
      if (!/^\d{10,15}$/.test(formData.ownerphone)) errors.ownerphone = "Invalid phone number";
      if (formData.Gender.length === 0) errors.Gender = "At least one tenant preference must be selected";
    }

    if (step === 2) {
      if (!formData.area) errors.area = "Area is required";
      if (formData.area < 50) errors.area = "Area should be at least 50 sq. ft";
      if (formData.propertyType.length === 0) errors.propertyType = "Select at least one property type";
      if (formData.bhkType.length === 0) errors.bhkType = "Select at least one BHK type";
      if (formData.furnishType.length === 0) errors.furnishType = "Select at least one furnish type";
    }

    if (step === 3) {
      if (!formData.monthlyRent) errors.monthlyRent = "Monthly rent is required";
      if (!formData.securityDeposit) errors.securityDeposit = "Security deposit is required";
      if (!formData.availableFrom) errors.availableFrom = "Available date is required";
      if (new Date(formData.availableFrom) < new Date()) errors.availableFrom = "Date cannot be in the past";
    }

    if (step === 4) {
      if (formData.images.length === 0 && formData.videos.length === 0) errors.media = "At least one image or video is required";
      if (formData.images.length > 10) errors.images = "Maximum 10 images allowed";
      if (formData.videos.length > 3) errors.videos = "Maximum 3 videos allowed";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNearbyChange = (e) => {
    const { name, value } = e.target;
    setNewNearby(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNearby = () => {
    if (!newNearby.name.trim()) {
      toast.error("Please enter a place name");
      return;
    }

    if (!newNearby.distance || isNaN(newNearby.distance)) {
      toast.error("Please enter a valid distance");
      return;
    }

    setFormData(prev => ({
      ...prev,
      nearby: [...prev.nearby, newNearby]
    }));

    setNewNearby({
      name: "",
      distance: "",
      unit: "km"
    });
  };

  const handleRemoveNearby = (index) => {
    setFormData(prev => ({
      ...prev,
      nearby: prev.nearby.filter((_, i) => i !== index)
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: updatedArray };
    });

    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    if (formData.images.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      const uploadedImages = [];
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error("Only image files are allowed");
          continue;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size should be less than 5MB");
          continue;
        }

        try {
          const uploadData = new FormData();
          uploadData.append("file", file);
          uploadData.append("upload_preset", "RentEase_Videos"); // Using the same preset that works for videos
          uploadData.append("cloud_name", "dkrrpzlbl");
          uploadData.append("resource_type", "image"); // Explicitly specify resource type
          
          const response = await fetch(
            "https://api.cloudinary.com/v1_1/dkrrpzlbl/image/upload",
            {
              method: "POST",
              body: uploadData,
            }
          );

          const data = await response.json();
          
          if (!response.ok) {
            console.error("Cloudinary response:", data);
            throw new Error(data.error?.message || "Upload failed");
          }

          if (data.secure_url) {
            console.log("✅ Cloudinary upload successful:", {
              filename: file.name,
              cloudinaryUrl: data.secure_url,
              publicId: data.public_id
            });
            uploadedImages.push({
              url: data.secure_url,
              public_id: data.public_id,
              type: "image"
            });
          }
        } catch (uploadError) {
          console.error("Error uploading individual file:", uploadError);
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }
      }

      if (uploadedImages.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedImages],
        }));
        toast.success(`Successfully uploaded ${uploadedImages.length} image(s)`);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error(error.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    if (formData.videos.length + files.length > 3) {
      toast.error("Maximum 3 videos allowed");
      return;
    }

    try {
      setUploadingVideos(true);
      setError(null);
      
      const uploadedVideos = [];
      for (const file of files) {
        try {
          const uploadData = new FormData();
          uploadData.append("file", file);
          uploadData.append("upload_preset", "RentEase_Videos");
          uploadData.append("cloud_name", "dkrrpzlbl");
          uploadData.append("resource_type", "video"); // Explicitly specify resource type
          
          const response = await fetch(
            "https://api.cloudinary.com/v1_1/dkrrpzlbl/video/upload",
            {
              method: "POST",
              body: uploadData,
            }
          );

          const data = await response.json();
          
          if (!response.ok) {
            console.error("Cloudinary response:", data);
            throw new Error(data.error?.message || "Upload failed");
          }

          if (data.secure_url) {
            console.log("✅ Cloudinary video upload successful:", {
              filename: file.name,
              cloudinaryUrl: data.secure_url,
              publicId: data.public_id
            });
            uploadedVideos.push({
              url: data.secure_url,
              public_id: data.public_id,
              type: "video"
            });
          }
        } catch (uploadError) {
          console.error("Error uploading individual video:", uploadError);
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }
      }

      if (uploadedVideos.length > 0) {
        setFormData(prev => ({
          ...prev,
          videos: [...prev.videos, ...uploadedVideos],
        }));
        toast.success(`Successfully uploaded ${uploadedVideos.length} video(s)`);
      }
    } catch (error) {
      console.error("Video upload failed:", error);
      toast.error(error.message || "Failed to upload videos");
    } finally {
      setUploadingVideos(false);
    }
  };

  // Function to remove an image
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Function to remove a video
  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please login.");
      }

      // Prepare data for submission
      const submitData = {
        description: formData.description.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        images: formData.images
          .filter(img => img.url && img.url.includes('cloudinary.com'))
          .map(img => ({
            url: img.url.trim(),
            type: img.type?.trim() || ""
          })),
        videos: formData.videos
          .filter(vid => vid.url && vid.url.includes('cloudinary.com'))
          .map(vid => ({
            url: vid.url.trim(),
            type: vid.type?.trim() || "video"
          })),
        propertyType: formData.propertyType.map(item => item.toLowerCase().trim()),
        bhkType: formData.bhkType.map(item => item.toUpperCase().trim()),
        furnishType: formData.furnishType.map(item => item.toLowerCase().trim()),
        area: Number(formData.area),
        facilities: formData.facilities.map(item => item.toLowerCase().trim()),
        monthlyRent: Number(formData.monthlyRent),
        availableFrom: new Date(formData.availableFrom).toISOString(),
        securityDeposit: Number(formData.securityDeposit),
        rentalDurationMonths: Number(formData.rentalDurationMonths) || 0,
        popularLocality: formData.popularLocality?.trim() || "",
        ownerphone: formData.ownerphone.trim(),
        nearby: formData.nearby.map(item => ({
          name: item.name?.trim() || "",
          distance: item.distance?.toString().trim() || "",
          unit: item.unit?.trim() || "km"
        })),
        ownerName: formData.ownerName.trim(),
        Gender: formData.Gender.map(item => item.trim()),
        coupleFriendly: Boolean(formData.coupleFriendly),
        floorNumber: Number(formData.floorNumber) || 0,
        totalFloors: Number(formData.totalFloors) || 0,
        ageOfProperty: Number(formData.ageOfProperty) || 0,
        facingDirection: formData.facingDirection?.trim() || "",
        maintenanceCharges: Number(formData.maintenanceCharges) || 0,
        parking: formData.parking?.trim() || "",
        waterSupply: formData.waterSupply?.trim() || "",
        electricityBackup: formData.electricityBackup?.trim() || "",
        balcony: Boolean(formData.balcony),
        petsAllowed: Boolean(formData.petsAllowed),
        nonVegAllowed: Boolean(formData.nonVegAllowed),
        smokingAllowed: Boolean(formData.smokingAllowed),
        bachelorAllowed: Boolean(formData.bachelorAllowed),
      };

      console.log("🚀 Submitting to backend with Cloudinary URLs:", {
        imageCount: submitData.images.length,
        videoCount: submitData.videos.length,
        imageUrls: submitData.images.map(img => img.url),
        videoUrls: submitData.videos.map(vid => vid.url)
      });

      console.log("📤 Complete submit data:", JSON.stringify(submitData, null, 2));

      const response = await axios.put(
        `http://localhost:5000/api/properties/${id}`,
        submitData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Backend response:", response.data);
      toast.success("Property updated successfully!");
      navigate("/my-properties");
    } catch (error) {
      console.error("❌ Update error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      
      if (error.response?.data?.errors) {
        // Handle server-side validation errors
        const errorMessages = Object.values(error.response.data.errors)
          .map(err => err.message || err)
          .join(", ");
        toast.error(`Validation errors: ${errorMessages}`);
      } else if (error.response?.data?.validationErrors) {
        // Handle validation errors from our updated backend
        const errorMessages = Object.values(error.response.data.validationErrors)
          .map(err => err.message || err)
          .join(", ");
        toast.error(`Validation errors: ${errorMessages}`);
      } else {
        toast.error(error.response?.data?.message || "Failed to update property");
      }
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const calculateProgress = () => {
    const stepDefinitions = [
      { fields: ["description", "address", "city", "state", "ownerName", "ownerphone", "Gender"], weight: 0.25 },
      { fields: ["area", "propertyType", "bhkType", "furnishType", "floorNumber", "totalFloors", "ageOfProperty", "facingDirection"], weight: 0.25 },
      { fields: ["monthlyRent", "securityDeposit", "availableFrom", "facilities", "maintenanceCharges"], weight: 0.25 },
      { fields: ["images", "videos"], weight: 0.25 }
    ];

    let totalProgress = 0;

    stepDefinitions.forEach(({ fields, weight }) => {
      let filledFields = 0;

      fields.forEach(field => {
        const value = formData[field];
        if (Array.isArray(value) && value.length > 0) filledFields++;
        else if (typeof value === 'string' && value.trim() !== '') filledFields++;
        else if (typeof value === 'number' && value > 0) filledFields++;
        else if (typeof value === 'boolean') filledFields++;
      });

      totalProgress += (filledFields / fields.length) * weight;
    });

    return Math.min(Math.round(totalProgress * 100), 100);
  };

  const progress = calculateProgress();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-purple-800 mb-6">Update Property</h1>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32">
              <CircularProgressbar
                value={progress}
                text={`${progress}%`}
                styles={buildStyles({
                  textColor: "#6B21A8",
                  pathColor: "#6B21A8",
                  trailColor: "#E9D5FF",
                })}
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            {[1, 2, 3, 4].map((stepNum) => (
              <div 
                key={stepNum}
                onClick={() => setStep(stepNum)}
                className={`flex flex-col items-center cursor-pointer p-2 rounded-lg ${
                  step === stepNum ? "bg-purple-100" : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNum ? "bg-purple-800 text-white" : "bg-gray-200"
                }`}>
                  {step > stepNum ? <FaCheck size={14} /> : stepNum}
                </div>
                <span className="text-sm mt-1">
                  {stepNum === 1 && "Basic Info"}
                  {stepNum === 2 && "Details"}
                  {stepNum === 3 && "Pricing"}
                  {stepNum === 4 && "Media"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className={`absolute bottom-2 right-2 p-2 rounded-full ${
                      isListening ? "bg-red-500 text-white" : "bg-purple-800 text-white"
                    }`}
                  >
                    {isListening ? <BsStopFill /> : <BsFillMicFill />}
                  </button>
                </div>
                {validationErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {validationErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {validationErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {validationErrors.state && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name*</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {validationErrors.ownerName && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.ownerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Phone*</label>
                  <input
                    type="tel"
                    name="ownerphone"
                    value={formData.ownerphone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {validationErrors.ownerphone && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.ownerphone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Preference*</label>
                <div className="flex flex-wrap gap-2">
                  {genderOptions.map(option => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.Gender.includes(option)}
                        onChange={() => handleMultiSelect("Gender", option)}
                        className="h-4 w-4 text-purple-800 rounded"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {validationErrors.Gender && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.Gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nearby Places</label>
                <div className="space-y-2">
                  {formData.nearby.map((place, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                      <span className="flex-1">
                        {place.name} ({place.distance} {place.unit})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNearby(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaMinus />
                      </button>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="text"
                      name="name"
                      value={newNearby.name}
                      onChange={handleNearbyChange}
                      placeholder="Place name"
                      className="p-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      name="distance"
                      value={newNearby.distance}
                      onChange={handleNearbyChange}
                      placeholder="Distance"
                      className="p-2 border border-gray-300 rounded-md"
                    />
                    <select
                      name="unit"
                      value={newNearby.unit}
                      onChange={handleNearbyChange}
                      className="p-2 border border-gray-300 rounded-md"
                    >
                      {distanceUnits.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNearby}
                    className="flex items-center px-3 py-1 bg-purple-800 text-white rounded-md hover:bg-purple-700 text-sm"
                  >
                    <FaPlus className="mr-1" /> Add Nearby Place
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Property Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq. ft)*</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min="50"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                {validationErrors.area && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.area}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type*</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {propertyOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.propertyType.includes(option.value)}
                        onChange={() => handleMultiSelect("propertyType", option.value)}
                        className="h-4 w-4 text-purple-800 rounded"
                      />
                      <span>{option.display}</span>
                    </label>
                  ))}
                </div>
                {validationErrors.propertyType && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.propertyType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BHK Type*</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {bhkOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.bhkType.includes(option.value)}
                        onChange={() => handleMultiSelect("bhkType", option.value)}
                        className="h-4 w-4 text-purple-800 rounded"
                      />
                      <span>{option.display}</span>
                    </label>
                  ))}
                </div>
                {validationErrors.bhkType && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.bhkType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Furnish Type*</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {furnishOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.furnishType.includes(option.value)}
                        onChange={() => handleMultiSelect("furnishType", option.value)}
                        className="h-4 w-4 text-purple-800 rounded"
                      />
                      <span>{option.display}</span>
                    </label>
                  ))}
                </div>
                {validationErrors.furnishType && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.furnishType}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number</label>
                  <input
                    type="number"
                    name="floorNumber"
                    value={formData.floorNumber}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label>
                  <input
                    type="number"
                    name="totalFloors"
                    value={formData.totalFloors}
                    onChange={handleChange}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age of Property (years)</label>
                  <input
                    type="number"
                    name="ageOfProperty"
                    value={formData.ageOfProperty}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facing Direction</label>
                  <select
                    name="facingDirection"
                    value={formData.facingDirection}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Direction</option>
                    {facingDirections.map(dir => (
                      <option key={dir} value={dir}>{dir}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Features</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="balcony"
                      checked={formData.balcony}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-800 rounded"
                    />
                    <span>Balcony</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="petsAllowed"
                      checked={formData.petsAllowed}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-800 rounded"
                    />
                    <span>Pets Allowed</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="nonVegAllowed"
                      checked={formData.nonVegAllowed}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-800 rounded"
                    />
                    <span>Non-Veg Allowed</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="smokingAllowed"
                      checked={formData.smokingAllowed}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-800 rounded"
                    />
                    <span>Smoking Allowed</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="bachelorAllowed"
                      checked={formData.bachelorAllowed}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-800 rounded"
                    />
                    <span>Bachelor Allowed</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="coupleFriendly"
                      checked={formData.coupleFriendly}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-800 rounded"
                    />
                    <span>Couple Friendly</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Facilities */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Pricing & Facilities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₹)*</label>
                  <input
                    type="number"
                    name="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {validationErrors.monthlyRent && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.monthlyRent}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)*</label>
                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {validationErrors.securityDeposit && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.securityDeposit}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available From*</label>
                  <input
                    type="date"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {validationErrors.availableFrom && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.availableFrom}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stay (months)</label>
                  <input
                    type="number"
                    name="rentalDurationMonths"
                    value={formData.rentalDurationMonths}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Charges (₹/month)</label>
                <input
                  type="number"
                  name="maintenanceCharges"
                  value={formData.maintenanceCharges}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {facilityOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(option.value)}
                        onChange={() => handleMultiSelect("facilities", option.value)}
                        className="h-4 w-4 text-purple-800 rounded"
                      />
                      <span>{option.display}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parking</label>
                  <select
                    name="parking"
                    value={formData.parking}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Parking Type</option>
                    <option value="None">None</option>
                    <option value="Street">Street Parking</option>
                    <option value="Allocated">Allocated Parking</option>
                    <option value="Garage">Garage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Water Supply</label>
                  <select
                    name="waterSupply"
                    value={formData.waterSupply}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Water Supply</option>
                    <option value="Corporation">Corporation Water</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Electricity Backup</label>
                <select
                  name="electricityBackup"
                  value={formData.electricityBackup}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Backup</option>
                  <option value="None">None</option>
                  <option value="Inverter">Inverter</option>
                  <option value="Generator">Generator</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Media */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Property Media</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images (Max 10)*</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <FaCamera className="mx-auto text-3xl text-purple-800 mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">JPEG, PNG (Max 5MB each)</p>
                  </label>
                </div>
                {validationErrors.images && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.images}</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Property ${index}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash size={12} />
                      </button>
                      <select
                        value={image.type || ""}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index].type = e.target.value;
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                        className="w-full mt-1 text-sm border rounded p-1"
                      >
                        <option value="">Select Category</option>
                        <option value="bedroom">Bedroom</option>
                        <option value="kitchen">Kitchen</option>
                        <option value="living-room">Living Room</option>
                        <option value="bathroom">Bathroom</option>
                        <option value="exterior">Exterior</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Videos (Max 3)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <FaVideo className="mx-auto text-3xl text-purple-800 mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadingVideos ? "Uploading..." : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">MP4, MOV (Max 500MB each)</p>
                  </label>
                </div>
                {validationErrors.videos && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.videos}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {formData.videos.map((video, index) => (
                    <div key={index} className="relative group">
                      <video
                        src={video.url}
                        controls
                        className="w-full h-48 bg-black rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                <FaArrowLeft className="mr-2" />
                Previous
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-700"
              >
                Next
                <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={uploading || uploadingVideos}
              >
                {uploading || uploadingVideos ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
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
  );
};

export default PropertyUpdateForm;