import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../lib/axios.js";
import { toast } from "react-toastify";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Step1 from "./stepOneUpdateproperty.jsx";
import Step2 from "./stepTwoUpdateproperty.jsx";
import Step3 from "./stepThreeUpdateporperty.jsx";
import Step4 from "./stepFourUpdateproperty.jsx";

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

  // Options data
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
        const response = await axios.get(`/api/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const property = response.data;
        
        // Format dates for date inputs
        let availableFrom = "";
        if (property.availableFrom) {
          const date = new Date(property.availableFrom);
          if (!isNaN(date.getTime())) {
            availableFrom = date.toISOString().split('T')[0];
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

        setFormData({
          description: property.description || "",
          address: property.address || "",
          city: property.city || "",
          state: property.state || "",
          images: property.images || [],
          videos: property.videos || [],
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
    if (!("webkitSpeechRecognition" in window)) return;

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
      setError("Maximum 10 images allowed");
      toast.error("Maximum 10 images allowed");
      return;
    }
  
    try {
      setUploading(true);
      setError(null);
  
      const uploadedImages = [];
  
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          setError("Only image files are allowed");
          toast.error("Only image files are allowed");
          continue;
        }
  
        if (file.size > 5 * 1024 * 1024) {
          setError("Image size should be less than 5MB");
          toast.error("Image size should be less than 5MB");
          continue;
        }
  
        try {
          const uploadData = new FormData();
          uploadData.append("file", file);
          uploadData.append("upload_preset", "roommilega_unsigned");
          uploadData.append("cloud_name", "dzopb3luc");
  
          const response = await fetch(
            "https://api.cloudinary.com/v1_1/dzopb3luc/image/upload",
            { method: "POST", body: uploadData }
          );
  
          const data = await response.json();
  
          if (!response.ok) {
            setError(data.error?.message || "Upload failed");
            throw new Error(data.error?.message || "Upload failed");
          }
  
          if (data.secure_url) {
            uploadedImages.push({
              url: data.secure_url,
              public_id: data.public_id,
              type: "image",
            });
          }
        } catch (uploadError) {
          setError(uploadError.message);
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }
      }
  
      if (uploadedImages.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedImages],
        }));
        toast.success(`Uploaded ${uploadedImages.length} image(s)`);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };
  
  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
  
    if (formData.videos.length + files.length > 3) {
      setError("Maximum 3 videos allowed");
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
          uploadData.append("upload_preset", "roommilega_unsigned");
          uploadData.append("cloud_name", "dzopb3luc");
  
          const response = await fetch(
            "https://api.cloudinary.com/v1_1/dzopb3luc/video/upload",
            { method: "POST", body: uploadData }
          );
  
          const data = await response.json();
  
          if (!response.ok) {
            setError(data.error?.message || "Upload failed");
            throw new Error(data.error?.message || "Upload failed");
          }

          if (data.secure_url) {
            uploadedVideos.push({
              url: data.secure_url,
              public_id: data.public_id,
              type: "video",
            });
          }
        } catch (uploadError) {
          setError(uploadError.message);
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }
      }
  
      if (uploadedVideos.length > 0) {
        setFormData(prev => ({
          ...prev,
          videos: [...prev.videos, ...uploadedVideos],
        }));
        toast.success(`Uploaded ${uploadedVideos.length} video(s)`);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "Failed to upload videos");
    } finally {
      setUploadingVideos(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

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
      if (!token) throw new Error("Authentication required. Please login.");

      const submitData = {
        description: formData.description.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        images: formData.images,
        videos: formData.videos,
        propertyType: formData.propertyType,
        bhkType: formData.bhkType,
        furnishType: formData.furnishType,
        area: Number(formData.area),
        facilities: formData.facilities,
        monthlyRent: Number(formData.monthlyRent),
        availableFrom: new Date(formData.availableFrom).toISOString(),
        securityDeposit: Number(formData.securityDeposit),
        rentalDurationMonths: Number(formData.rentalDurationMonths) || 0,
        popularLocality: formData.popularLocality?.trim() || "",
        ownerphone: formData.ownerphone.trim(),
        nearby: formData.nearby,
        ownerName: formData.ownerName.trim(),
        Gender: formData.Gender,
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

      await axios.put(
        `/api/properties/${id}`,
        submitData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Property updated successfully!");
      navigate("/my-properties");
    } catch (error) {
      console.error("Update error:", error);
      
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
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
          {step === 1 && (
            <Step1
              formData={formData}
              newNearby={newNearby}
              handleChange={handleChange}
              handleNearbyChange={handleNearbyChange}
              handleAddNearby={handleAddNearby}
              handleRemoveNearby={handleRemoveNearby}
              handleMultiSelect={handleMultiSelect}
              validationErrors={validationErrors}
              isListening={isListening}
              startListening={startListening}
              stopListening={stopListening}
              genderOptions={genderOptions}
              nearbyOptions={nearbyOptions}
              distanceUnits={distanceUnits}
            />
          )}

          {step === 2 && (
            <Step2
              formData={formData}
              handleChange={handleChange}
              handleMultiSelect={handleMultiSelect}
              validationErrors={validationErrors}
              propertyOptions={propertyOptions}
              bhkOptions={bhkOptions}
              furnishOptions={furnishOptions}
              facingDirections={facingDirections}
            />
          )}

          {step === 3 && (
            <Step3
              formData={formData}
              handleChange={handleChange}
              handleMultiSelect={handleMultiSelect}
              validationErrors={validationErrors}
              facilityOptions={facilityOptions}
            />
          )}

          {step === 4 && (
            <Step4
              formData={formData}
              uploading={uploading}
              uploadingVideos={uploadingVideos}
              handleImageUpload={handleImageUpload}
              handleVideoUpload={handleVideoUpload}
              removeImage={removeImage}
              removeVideo={removeVideo}
              validationErrors={validationErrors}
            />
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