import axios from "../axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaTrash, FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import { useState, useEffect } from "react";

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    images: [],
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
    Gender: "",
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
    bachelorAllowed: false
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to add a property");
      const timer = setTimeout(() => navigate('/login'), 10000);
      return () => clearTimeout(timer);
    }
    setIsAuthenticated(true);
  }, [navigate]);

  // Enum options - all values in lowercase to match backend
  const propertyOptions = [
    { display: "Apartment", value: "apartment" },
    { display: "Independent Floor", value: "independent floor" },
    { display: "Independent House", value: "independent house" },
    { display: "Farm House", value: "farm house" }
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
    { display: "Unfurnished", value: "unfurnished" }
  ];

  const facilityOptions = [
    { display: "Electricity", value: "electricity" },
    { display: "WiFi", value: "wifi" },
    { display: "Water Supply", value: "water supply" },
    { display: "Parking", value: "parking" },
    { display: "Security", value: "security" },
    { display: "Lift", value: "lift" },
    { display: "Gym", value: "gym" },
    { display: "Swimming Pool", value: "swimming pool" }
  ];

  const genderOptions = ["Male", "Female", "Unisex"];
  const facingDirections = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.title.trim()) errors.title = "Title is required";
      if (!formData.description.trim()) errors.description = "Description is required";
      if (!formData.address.trim()) errors.address = "Address is required";
      if (!formData.city.trim()) errors.city = "City is required";
      if (!formData.state.trim()) errors.state = "State is required";
      if (!formData.ownerName.trim()) errors.ownerName = "Owner name is required";
      if (!formData.ownerphone.trim()) errors.ownerphone = "Phone number is required";
      if (!/^\d{10,15}$/.test(formData.ownerphone)) errors.ownerphone = "Invalid phone number";
      if (!formData.Gender) errors.Gender = "Please select a gender";
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
      if (formData.images.length === 0) errors.images = "At least one image is required";
      if (formData.images.length > 10) errors.images = "Maximum 10 images allowed";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prevData) => {
      const currentArray = Array.isArray(prevData[field]) ? prevData[field] : [];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
  
      return { ...prevData, [field]: updatedArray };
    });
    
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    if (formData.images.length + files.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }

    const uploadData = new FormData();
    files.forEach(file => {
      uploadData.append("images", file);
    });

    try {
      setUploading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/properties/upload", uploadData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });

      const newImageUrls = res.data.imageUrls || [];
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls]
      }));
      setPreviewImages(prev => [...prev, ...newImageUrls]);
    } catch (error) {
      console.error("Image upload failed:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(error.response?.data?.message || "Failed to upload images. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateStep(4)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // <div clas></div>
        throw new Error(`required. Please login.` );
      }

      // Prepare data with lowercase enum values for backend
      const submitData = {
        ...formData,
        propertyType: formData.propertyType.map(item => item.toLowerCase()),
        bhkType: formData.bhkType.map(item => item.toLowerCase()),
        furnishType: formData.furnishType.map(item => item.toLowerCase()),
        facilities: formData.facilities.map(item => item.toLowerCase()),
        nearby: formData.nearby.filter(item => item.trim() !== ""),
        images: formData.images
      };

      console.log("Submitting data:", submitData);

      const response = await axios.post(
        "http://localhost:5000/api/properties/add",
        submitData,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      console.log("Property added successfully:", response.data);
      setSuccess(true);
      
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          address: "",
          city: "",
          state: "",
          images: [],
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
          Gender: "",
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
          bachelorAllowed: false
        });
        setPreviewImages([]);
        navigate('/my-properties');
      }, 2000);

    } catch (error) {
      console.error("Submission Error:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(error.response?.data?.message || 
                error.message || 
                "Failed to add property. Please try again.");
      }
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 4) setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  // Calculate progress based on current step and fields filled
  const calculateProgress = () => {
    // Define required fields for each step
    const requiredFieldsByStep = {
      1: ['title', 'description', 'address', 'city', 'state', 'ownerName', 'ownerphone', 'Gender'],
      2: ['area', 'propertyType', 'bhkType', 'furnishType'],
      3: ['monthlyRent', 'securityDeposit', 'availableFrom'],
      4: ['images']
    };

    // Calculate progress within current step
    const currentStepFields = requiredFieldsByStep[step];
    const filledInCurrentStep = currentStepFields.filter(field => {
      const value = formData[field];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return true;
      return value.toString().trim() !== "";
    }).length;

    const stepProgress = (filledInCurrentStep / currentStepFields.length) * 25;
    
    // Add progress from previous steps
    let totalProgress = 0;
    for (let i = 1; i < step; i++) {
      totalProgress += 25; // Each previous step is worth 25%
    }
    
    return totalProgress + stepProgress;
  };

  const progress = calculateProgress();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-purple-800 w-[100%] h-15"></div>
      <div className="flex flex-col md:flex-row items-start justify-center min-h-[90vh] p-4 md:p-6 h-[90vh] bg-white w-[100%]">
        {/* Progress Sidebar */} 
        <div className="hidden md:block w-64 mr-8 p-6 rounded-lg shadow-md sticky top-2 h-150 border-2 border-purple-800">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 text-bold">
              <CircularProgressbar
                value={progress} 
                text={`${Math.round(progress)}%`}
                styles={buildStyles({
                  textColor: "#000000",
                  pathColor: "#6B21A8",
                  trailColor: "#D1D5DB",
                  textSize: '24px text-bold'
                })}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div 
                key={stepNumber}
                className={`flex items-center p-3 rounded-lg cursor-pointer ${step === stepNumber ? 'bg-purple-200 border-l-4 border-purple-800' : ''}`}
                onClick={() => setStep(stepNumber)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step >= stepNumber ? 'bg-purple-800 text-white text-bold' : 'bg-gray-200'}`}>
                  {step > stepNumber ? <FaCheck size={14} /> : stepNumber}
                </div>
                <div>
                  <h3 className="text-purple-800 font-bold">Step {stepNumber}</h3>
                  <p className="text-sm text-purple-800 text-semibold">
                    {stepNumber === 1 && "Basic Information"}
                    {stepNumber === 2 && "Property Details"}
                    {stepNumber === 3 && "Rent & Facilities"}
                    {stepNumber === 4 && "Upload Images"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Progress Indicator */}
        <div className="md:hidden w-full mb-4 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="w-16 h-16">
              <CircularProgressbar
                value={progress}
                text={`${Math.round(progress)}%`}
                styles={buildStyles({
                  textColor: "#1D4ED8",
                  pathColor: "#1D4ED8",
                  trailColor: "#D1D5DB",
                  textSize: '16px'
                })}
              />
            </div>
            <div className="flex-1 ml-4">
              <div className="flex justify-between mb-1">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div 
                    key={stepNumber}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {step > stepNumber ? <FaCheck size={10} /> : stepNumber}
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">
                {step === 1 && "Basic Information"}
                {step === 2 && "Property Details"}
                {step === 3 && "Rent & Facilities"}
                {step === 4 && "Upload Images"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg h-150 overflow-y-auto shadow-2xl border-2 border-purple-800">
          <h2 className="text-2xl font-bold text-center mb-6 text-purple-800">Add Property - Step {step}</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex justify-between items-center">
              <span>{error}</span>
              {error.includes("login") && (
                <button 
                  onClick={() => navigate('/login')}
                  className="ml-2 underline font-medium"
                >
                  Login Now
                </button>
              )}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex items-center">
              <FaCheck className="mr-2" />
              Property added successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4 text-bold border-purple-800 outline-none">
                {[
                  { field: "title", label: "Property Title", type: "text", required: true },
                  { field: "description", label: "Description", type: "textarea", required: true },
                  { field: "address", label: "Full Address", type: "text", required: true },
                  { field: "city", label: "City", type: "text", required: true },
                  { field: "state", label: "State", type: "text", required: true },
                  { field: "popularLocality", label: "Popular Locality", type: "text" },
                  { field: "ownerName", label: "Owner Name", type: "text", required: true },
                  { field: "ownerphone", label: "Owner Phone", type: "tel", required: true }
                ].map(({ field, label, type, required }) => (
                  <div key={field}>
                    <label className="font-bold text-sm text-purple-800 outline-none mb-1">
                      {label} {required && <span className="text-purple-800">*</span>}
                    </label>
                    {type === "textarea" ? (
                      <textarea
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md focus:ring focus:ring-blue-300 cursor-pointer"
                        required={required}
                        rows={4}
                      />
                    ) : (
                      <input
                        type={type}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md focus:ring focus:ring-blue-300 cursor-pointer"
                        required={required}
                        minLength={field === "ownerphone" ? 10 : 3}
                        maxLength={field === "ownerphone" ? 15 : undefined}
                      />
                    )}
                    {validationErrors[field] && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors[field]}</p>
                    )}
                  </div>
                ))}
                
                <div>
                  <label className="block text-sm font-bold text-purple-800 mb-1">
                  Preferred Tenant <span className="text-purple-800">*</span>
                  </label>
                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md text-purple-800  cursor-pointer"
                    required
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {validationErrors.Gender && (
                    <p className="mt-1 text-sm text-purple-800">{validationErrors.Gender}</p>
                  )}
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
                    value={formData.area}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border border-purple-800 rounded-md outline-none cursor-pointer"
                    required
                    min="50"
                    max="10000"
                  />
                  {validationErrors.area && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.area}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-purple-800 mb-1">Nearby Places</label>
                  <input
                    type="text"
                    name="nearby"
                    value={formData.nearby.join(", ")}
                    onChange={(e) => {
                      const values = e.target.value.split(",").map(item => item.trim());
                      setFormData({...formData, nearby: values});
                    }}
                    className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md text-purple-800 cursor-pointer"
                    placeholder="e.g. Metro station, Mall, Hospital"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-purple-800 mb-1">
                      Floor Number
                    </label>
                    <input
                      type="number"
                      name="floorNumber"
                      value={formData.floorNumber}
                      onChange={handleChange}
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
                      value={formData.totalFloors}
                      onChange={handleChange}
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
                      value={formData.ageOfProperty}
                      onChange={handleChange}
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
                      value={formData.facingDirection}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md text-purple-800 cursor-pointer"
                    >
                      <option value="">Select Direction</option>
                      {facingDirections.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {[
                  { label: "Property Type", field: "propertyType", options: propertyOptions, required: true },
                  { label: "BHK Type", field: "bhkType", options: bhkOptions, required: true },
                  { label: "Furnish Type", field: "furnishType", options: furnishOptions, required: true },
                ].map(({ label, field, options, required }) => (
                  <div key={field} className="mt-4">
                    <label className="block text-sm font-bold text-purple-800 mb-1">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {options.map((option) => (
                        <label key={option.value} className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData[field].includes(option.value)}
                            onChange={() => handleMultiSelect(field, option.value)}
                            className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                          />
                          <span className="ml-2 text-sm text-purple-800">{option.display}</span>
                        </label>
                      ))}
                    </div>
                    {validationErrors[field] && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors[field]}</p>
                    )}
                  </div>
                ))}

                <div className="mt-4">
                  <label className="block text-sm font-bold text-purple-800 mb-1">Additional Features</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {[
                      { field: "balcony", label: "Balcony" },
                      { field: "petsAllowed", label: "Pets Allowed" },
                      { field: "nonVegAllowed", label: "Non-Veg Allowed" },
                      { field: "smokingAllowed", label: "Smoking Allowed" },
                      { field: "bachelorAllowed", label: "Bachelor Allowed" }
                    ].map(({ field, label }) => (
                      <label key={field} className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[field]}
                          onChange={handleChange}
                          name={field}
                          className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                        />
                        <span className="ml-2 text-sm text-purple-800">{label}</span>
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
                  <label className="block text-sm font-bold text-purple-800 mb-1">Facilities</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {facilityOptions.map((option) => (
                      <label key={option.value} className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(option.value)}
                          onChange={() => handleMultiSelect("facilities", option.value)}
                          className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                        />
                        <span className="ml-2 text-sm text-purple-800">{option.display}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { field: "monthlyRent", label: "Monthly Rent (₹)", required: true },
                    { field: "securityDeposit", label: "Security Deposit (₹)", required: true },
                    { field: "rentalDurationMonths", label: "Minimum Stay (months)" },
                    { field: "maintenanceCharges", label: "Maintenance Charges (₹/month)" },
                  ].map(({ field, label, required }) => (
                    <div key={field}>
                      <label className="block text-sm font-bold text-purple-800 mb-1">
                        {label} {required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="number"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
                        required={required}
                        min="0"
                        step={field.includes("Rent") ? "1000" : "100"}
                      />
                      {validationErrors[field] && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors[field]}</p>
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
                      value={formData.availableFrom}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {validationErrors.availableFrom && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.availableFrom}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-purple-800 mb-1">
                      Parking
                    </label>
                    <select
                      name="parking"
                      value={formData.parking}
                      onChange={handleChange}
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
                      value={formData.waterSupply}
                      onChange={handleChange}
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
                      value={formData.electricityBackup}
                      onChange={handleChange}
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

            {/* Step 4: Upload Images */}
            {step === 4 && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-purple-800 mb-1">
                  Upload Images (Max 10) <span className="text-red-500">*</span>
                </label>
                
                <div className="relative border-2 border-dashed border-purple-800 rounded-lg p-6 text-center hover:border-purple-600 transition cursor-pointer">
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
                      {uploading ? "Uploading..." : "Click to browse or drag and drop images"}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      JPEG, PNG (Max 5MB each)
                    </p>
                  </div>
                </div>
                
                {validationErrors.images && (
                  <p className="text-sm text-red-600">{validationErrors.images}</p>
                )}
                
                {uploading && (
                  <div className="text-purple-800 flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-800" xmlns="http://www.w3.org/3000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImages(prev => prev.filter((_, i) => i !== index));
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
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
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={uploading || formData.images.length === 0}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Submit Property
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProperty;