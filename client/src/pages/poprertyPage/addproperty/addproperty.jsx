import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaCheck, FaArrowLeft } from "react-icons/fa";

import axios from "../../../lib/axios.js";
import { toast } from "react-hot-toast";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Step1 from "./stepOneAddproperty.jsx";
import Step2 from "./stepTwoAddproperty.jsx";
import Step3 from "./stepThreeAddproperty.jsx";
import Step4 from "./stepFourAddproperty.jsx";

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    address: "",
    city: "",
    state: "",
    images: [],
    videos: [],
    propertyType: "", // now a string
    roomSubcategory: "",
    apartmentSubcategory: "",
    pgSubcategory: "",
    otherSubcategory: "",
    area: "",
    furnishType: [],
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

  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideos, setPreviewVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showOwnerModal, setShowOwnerModal] = useState(false);

  const formRef = useRef(null);
  // Top reference for scroll
  const topRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to add a property");
      const timer = setTimeout(() => navigate("/login"));
      return () => clearTimeout(timer);
    }
    setIsAuthenticated(true);
    // Check for owner role
    const role = localStorage.getItem("role");
    if (role !== "owner") {
      setShowOwnerModal(true);
    }
  }, [navigate]);



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
      if (!formData.propertyType) errors.propertyType = "Select a property type";
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Reset subcategory fields if propertyType changes
    if (name === "propertyType") {
      setFormData((prev) => ({
        ...prev,
        roomSubcategory: "",
        apartmentSubcategory: "",
        pgSubcategory: "",
        otherSubcategory: "",
      }));
    }

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
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
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateStep(4)) return;

    // --- ENUMS (must match backend) ---
    const propertyTypeEnum = ["room", "apartment", "pg", "other"];
    const roomSubEnum = ["independent room", "shared room", "coed"];
    const apartmentSubEnum = ["1BHK", "2BHK", "3BHK & above"];
    const pgSubEnum = ["PG for boys", "PG for girls", "coed"];
    const otherSubEnum = ["farm house", "villa", "studio apartment", "commercial"];
    const furnishTypeEnum = ["fully furnished", "semi furnished", "unfurnished"];
    const genderEnum = ["Couple Friendly", "Family", "Student", "Working professional", "Single"];
    const facilitiesEnum = ["electricity", "wifi", "water supply", "parking", "security", "lift", "gym", "swimming pool"];

    // Defensive: propertyType as string and valid
    let safePropertyType = formData.propertyType;
    if (Array.isArray(safePropertyType)) {
      safePropertyType = safePropertyType[0] || "";
    }
    if (typeof safePropertyType !== "string" || !propertyTypeEnum.includes(safePropertyType)) {
      setError("Invalid property type selected.");
      return;
    }

    // Only include the relevant subcategory
    let subcategoryField = null;
    let subcategoryValue = null;
    if (safePropertyType === "room") {
      subcategoryField = "roomSubcategory";
      subcategoryValue = formData.roomSubcategory;
      if (!roomSubEnum.includes(subcategoryValue)) {
        setError("Invalid or missing room subcategory.");
        return;
      }
    } else if (safePropertyType === "apartment") {
      subcategoryField = "apartmentSubcategory";
      subcategoryValue = formData.apartmentSubcategory;
      if (!apartmentSubEnum.includes(subcategoryValue)) {
        setError("Invalid or missing apartment subcategory.");
        return;
      }
    } else if (safePropertyType === "pg") {
      subcategoryField = "pgSubcategory";
      subcategoryValue = formData.pgSubcategory;
      if (!pgSubEnum.includes(subcategoryValue)) {
        setError("Invalid or missing PG subcategory.");
        return;
      }
    } else if (safePropertyType === "other") {
      subcategoryField = "otherSubcategory";
      subcategoryValue = formData.otherSubcategory;
      if (!otherSubEnum.includes(subcategoryValue)) {
        setError("Invalid or missing other subcategory.");
        return;
      }
    }

    // Defensive: arrays of allowed values
    const safeArray = (arr, allowed) => {
      if (!arr) return [];
      if (!Array.isArray(arr)) arr = [arr];
      arr = arr.map((v) => (typeof v === "string" ? v.trim() : "")).filter(Boolean);
      for (const v of arr) {
        if (!allowed.includes(v)) {
          setError(`Invalid value: ${v}`);
          return null;
        }
      }
      return arr;
    };
    const safeGender = safeArray(formData.Gender, genderEnum);
    if (!safeGender) return;
    const safeFurnishType = safeArray(formData.furnishType, furnishTypeEnum);
    if (!safeFurnishType) return;
    const safeFacilities = safeArray(formData.facilities, facilitiesEnum);
    if (!safeFacilities) return;

    // Build payload
    const submitData = {
      ...formData,
      propertyType: safePropertyType,
      [subcategoryField]: subcategoryValue,
      Gender: safeGender,
      furnishType: safeFurnishType,
      facilities: safeFacilities,
      area: formData.area ? Number(formData.area) : undefined,
      monthlyRent: formData.monthlyRent ? Number(formData.monthlyRent) : undefined,
      securityDeposit: formData.securityDeposit ? Number(formData.securityDeposit) : undefined,
      rentalDurationMonths: formData.rentalDurationMonths ? Number(formData.rentalDurationMonths) : undefined,
      availableFrom: formData.availableFrom ? new Date(formData.availableFrom).toISOString() : undefined,
    };
    // Remove unused subcategories
    ["roomSubcategory", "apartmentSubcategory", "pgSubcategory", "otherSubcategory"].forEach((f) => {
      if (f !== subcategoryField) delete submitData[f];
    });

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required. Please login.");

      await axios.post("/api/properties/add", submitData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(true);
      toast.success("Property added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Submission Error:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"));
      } else if (error.response && error.response.status === 400 && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to add property. Please try again."
        );
      }
    }
  };

  const nextStep = () => {
    if (validateStep(step) && step < 4) {
      setStep((prev) => prev + 1);
      // Scroll to top of form on next step
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      // Scroll to top of form on previous step
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const calculateProgress = () => {
    const stepDefinitions = [
      { name: "step1", fields: ["description", "address", "city", "state", "ownerName", "ownerphone", "Gender", "popularLocality"], weight: 0.2633 },
      { name: "step2", fields: ["area", "propertyType", "bhkType", "furnishType", "floorNumber", "totalFloors", "ageOfProperty", "facingDirection", "nearby", "balcony", "petsAllowed", "nonVegAllowed", "smokingAllowed", "bachelorAllowed"], weight: 0.2633 },
      { name: "step3", fields: ["facilities", "monthlyRent", "securityDeposit", "rentalDurationMonths", "maintenanceCharges", "availableFrom", "parking", "waterSupply", "electricityBackup"], weight: 0.2633 },
      { name: "step4", fields: ["images", "videos"], weight: 0.30 }
    ];
  
    let totalProgress = 0;
    stepDefinitions.forEach(step => {
      const { fields, weight } = step;
      let filledFields = 0;
      fields.forEach(field => {
        const value = formData[field];
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
    return Math.min(Math.max(Math.round(totalProgress * 100), 0), 100);
  };

  const progress = calculateProgress();

  if (showOwnerModal) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-4 text-purple-800">Owner Signup Required</h2>
          <p className="mb-6 text-gray-700">Please use <span className="font-semibold text-purple-700">List My Property</span> to sign up as an owner, then login to add your property.</p>
          <button
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
            onClick={() => navigate("/signup")}
          >
            Go to Signup
          </button>
        </div>
      </div>
    );
  }

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
      <div ref={topRef}></div>
      <div className="bg-slate-700 w-[100%] h-19"></div>
      <div className="flex flex-col md:flex-row items-start justify-center min-h-[90vh] p-4 md:p-6 h-[90vh] bg-white w-[100%]">
        {/* Sidebar - Steps Indicator */}
        <div className="hidden md:block w-64 mr-8 p-6 rounded-lg shadow-md sticky top-2 h-150 border-2 border-indigo-600">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 font-bold">
              <CircularProgressbar
                value={progress}
                text={`${Math.round(progress)}%`}
                styles={buildStyles({
                  textColor: "#1F2937", // slate-800
                  pathColor: "#4F46E5", // indigo-600
                  trailColor: "#E5E7EB", // slate-200
                  textSize: "24px",
                })}
              />
            </div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                  step === stepNumber ? "bg-slate-50 border border-slate-200 shadow-sm" : ""
                }`}
                onClick={() => setStep(stepNumber)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-semibold text-sm ${
                    step >= stepNumber ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {step > stepNumber ? <FaCheck size={14} /> : stepNumber}
                </div>
                <div>
                  <h3 className="text-indigo-600 font-semibold">Step {stepNumber}</h3>
                  <p className="text-sm text-slate-700">
                    {stepNumber === 1 && "Basic Information"}
                    {stepNumber === 2 && "Property Details"}
                    {stepNumber === 3 && "Rent & Facilities"}
                    {stepNumber === 4 && "Upload Media"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg h-150 overflow-y-auto shadow-2xl border-2 border-purple-800">
          <h2 className="text-2xl font-bold text-center mb-6 text-purple-800">
            Add Property - Step {step}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex justify-between items-center">
              <span>{error}</span>
              {error.includes("login") && (
                <button onClick={() => navigate("/login")} className="ml-2 underline font-medium">
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
            {step === 1 && (
              <Step1
                formData={formData}
                handleChange={handleChange}
                handleMultiSelect={handleMultiSelect}
                validationErrors={validationErrors}
              />
            )}

            {step === 2 && (
              <Step2
                formData={formData}
                handleChange={handleChange}
                handleMultiSelect={handleMultiSelect}
                validationErrors={validationErrors}
              />
            )}

            {step === 3 && (
              <Step3
                formData={formData}
                handleChange={handleChange}
                handleMultiSelect={handleMultiSelect}
                validationErrors={validationErrors}
              />
            )}

            {step === 4 && (
              <Step4
                formData={formData}
                previewImages={previewImages}
                previewVideos={previewVideos}
                uploading={uploading}
                uploadingVideos={uploadingVideos}
                uploadProgress={uploadProgress}
                setFormData={setFormData}
                setPreviewImages={setPreviewImages}
                setPreviewVideos={setPreviewVideos}
                setUploading={setUploading}
                setUploadingVideos={setUploadingVideos}
                setUploadProgress={setUploadProgress}
                validationErrors={validationErrors}
                setError={setError}
              />
            )}

            <div className="flex justify-between mt-8 pt-4 border-t border-purple-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-4 py-2 bg-gray-200 text-indigo-600 rounded-md hover:bg-gray-300 transition cursor-pointer"
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
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md  rounded-md mt-1 font-mono transition cursor-pointer"
                  disabled={Object.keys(validationErrors).length > 0}
                >
                  Next
                  <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className={`flex items-center px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-green-700 transition cursor-pointer ${
                    uploading || uploadingVideos ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={uploading || uploadingVideos || (formData.images.length === 0 && formData.videos.length === 0)}
                >
                  {uploading || uploadingVideos ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
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
