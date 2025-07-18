import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaArrowRight, FaArrowLeft, FaCheck } from "react-icons/fa";
import axios from "../../../../lib/axios.js";

import PropertyFormStep1 from "./propertyFormStep1.jsx";
import PropertyFormStep2 from "./propertyFormStep2.jsx";
import PropertyFormStep3 from "./propertyFormStep3.jsx";
import PropertyFormStep4 from "./propertyFormStep4.jsx";
import ProgressIndicator from "./progressIndicator.jsx";

const EditPropertyModal = ({ editingProperty, setEditingProperty }) => {
  const [step, setStep] = useState(1);
  const [editFormData, setEditFormData] = useState({
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
    nearby: [],
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
  const [validationErrors, setValidationErrors] = useState({});
  const [updateClickCount, setUpdateClickCount] = useState(0);

  useEffect(() => {
    if (editingProperty) {
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
      let safePropertyType = editingProperty.propertyType;
      if (Array.isArray(safePropertyType)) {
        safePropertyType = safePropertyType[0] || "";
      }
      if (typeof safePropertyType !== "string" || !propertyTypeEnum.includes(safePropertyType)) {
        toast.error("Invalid property type in fetched data.");
        setEditingProperty(null);
        return;
      }

      // Only keep the relevant subcategory
      let subcategoryField = null;
      let subcategoryValue = null;
      if (safePropertyType === "room") {
        subcategoryField = "roomSubcategory";
        subcategoryValue = editingProperty.roomSubcategory;
        if (!roomSubEnum.includes(subcategoryValue)) {
          toast.error("Invalid or missing room subcategory in fetched data.");
          setEditingProperty(null);
          return;
        }
      } else if (safePropertyType === "apartment") {
        subcategoryField = "apartmentSubcategory";
        subcategoryValue = editingProperty.apartmentSubcategory;
        if (!apartmentSubEnum.includes(subcategoryValue)) {
          toast.error("Invalid or missing apartment subcategory in fetched data.");
          setEditingProperty(null);
          return;
        }
      } else if (safePropertyType === "pg") {
        subcategoryField = "pgSubcategory";
        subcategoryValue = editingProperty.pgSubcategory;
        if (!pgSubEnum.includes(subcategoryValue)) {
          toast.error("Invalid or missing PG subcategory in fetched data.");
          setEditingProperty(null);
          return;
        }
      } else if (safePropertyType === "other") {
        subcategoryField = "otherSubcategory";
        subcategoryValue = editingProperty.otherSubcategory;
        if (!otherSubEnum.includes(subcategoryValue)) {
          toast.error("Invalid or missing other subcategory in fetched data.");
          setEditingProperty(null);
          return;
        }
      }

      // Defensive: arrays of allowed values
      const safeArray = (arr, allowed) => {
        if (!arr) return [];
        if (!Array.isArray(arr)) arr = [arr];
        arr = arr.map(v => typeof v === 'string' ? v.trim() : '').filter(Boolean);
        for (const v of arr) {
          if (!allowed.includes(v)) {
            toast.error(`Invalid value in fetched data: ${v}`);
            setEditingProperty(null);
            return null;
          }
        }
        return arr;
      };
      const safeGender = safeArray(editingProperty.Gender, genderEnum);
      if (!safeGender) return;
      const safeFurnishType = safeArray(editingProperty.furnishType, furnishTypeEnum);
      if (!safeFurnishType) return;
      const safeFacilities = safeArray(editingProperty.facilities, facilitiesEnum);
      if (!safeFacilities) return;

      // Build normalized state
      setEditFormData(prev => ({
        ...prev,
        ...editingProperty,
        propertyType: safePropertyType,
        [subcategoryField]: subcategoryValue,
        Gender: safeGender,
        furnishType: safeFurnishType,
        facilities: safeFacilities,
      }));
      setPreviewImages(editingProperty.images?.map(img => img.url) || []);
      setPreviewVideos(editingProperty.videos?.map(vid => vid.url) || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProperty]);

  // Defensive propertyType change handler for edit form
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "propertyType") {
      setEditFormData((prev) => ({
        ...prev,
        propertyType: value, // always a string
        roomSubcategory: "",
        apartmentSubcategory: "",
        pgSubcategory: "",
        otherSubcategory: "",
      }));
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Model-compliant multi-select handler
  const handleMultiSelect = (field, value) => {
    setEditFormData((prevData) => {
      const currentArray = Array.isArray(prevData[field]) ? prevData[field] : [];
      let updatedArray;
      if (Array.isArray(value)) {
        updatedArray = value; // For select all
      } else {
        updatedArray = currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value];
      }
      return { ...prevData, [field]: updatedArray };
    });
  };

  const validateStep = (currentStep) => {
    const errors = {};
    // TODO: Step-wise validations
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePropertyUpdate = async (e) => {
    e.preventDefault();
    if (updateClickCount < 1) {
      setUpdateClickCount(1);
      alert("Please press 'Update Property' button again to confirm update.");
      return;
    }
    if (!validateStep(4)) return;

    const token = localStorage.getItem("token");
    console.log("Token being sent:", token);
    if (!token) {
      toast.error("You are not logged in. Please log in again.");
      setEditingProperty(null);
      return;
    }

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
    let safePropertyType = editFormData.propertyType;
    if (Array.isArray(safePropertyType)) {
      safePropertyType = safePropertyType[0] || "";
    }
    if (typeof safePropertyType !== "string") {
      safePropertyType = String(safePropertyType);
    }
    if (typeof safePropertyType !== "string" || !propertyTypeEnum.includes(safePropertyType)) {
      toast.error("Invalid property type selected.");
      return;
    }

    // Only include the relevant subcategory
    let subcategoryField = null;
    let subcategoryValue = null;
    if (safePropertyType === "room") {
      subcategoryField = "roomSubcategory";
      subcategoryValue = editFormData.roomSubcategory;
      if (!roomSubEnum.includes(subcategoryValue)) {
        toast.error("Invalid or missing room subcategory.");
        return;
      }
    } else if (safePropertyType === "apartment") {
      subcategoryField = "apartmentSubcategory";
      subcategoryValue = editFormData.apartmentSubcategory;
      if (!apartmentSubEnum.includes(subcategoryValue)) {
        toast.error("Invalid or missing apartment subcategory.");
        return;
      }
    } else if (safePropertyType === "pg") {
      subcategoryField = "pgSubcategory";
      subcategoryValue = editFormData.pgSubcategory;
      if (!pgSubEnum.includes(subcategoryValue)) {
        toast.error("Invalid or missing PG subcategory.");
        return;
      }
    } else if (safePropertyType === "other") {
      subcategoryField = "otherSubcategory";
      subcategoryValue = editFormData.otherSubcategory;
      if (!otherSubEnum.includes(subcategoryValue)) {
        toast.error("Invalid or missing other subcategory.");
        return;
      }
    }

    // Defensive: arrays of allowed values
    const safeArray = (arr, allowed) => {
      if (!arr) return [];
      if (!Array.isArray(arr)) arr = [arr];
      arr = arr.map(v => typeof v === 'string' ? v.trim() : '').filter(Boolean);
      for (const v of arr) {
        if (!allowed.includes(v)) {
          toast.error(`Invalid value: ${v}`);
          return null;
        }
      }
      return arr;
    };
    const safeGender = safeArray(editFormData.Gender, genderEnum);
    if (!safeGender) return;
    const safeFurnishType = safeArray(editFormData.furnishType, furnishTypeEnum);
    if (!safeFurnishType) return;
    const safeFacilities = safeArray(editFormData.facilities, facilitiesEnum);
    if (!safeFacilities) return;

    // Build payload
    const submitData = {
      ...editFormData,
      propertyType: Array.isArray(editFormData.propertyType) ? editFormData.propertyType[0] : editFormData.propertyType,
      [subcategoryField]: subcategoryValue,
      Gender: safeGender,
      furnishType: safeFurnishType,
      facilities: safeFacilities,
      area: editFormData.area ? Number(editFormData.area) : undefined,
      monthlyRent: editFormData.monthlyRent ? Number(editFormData.monthlyRent) : undefined,
      securityDeposit: editFormData.securityDeposit ? Number(editFormData.securityDeposit) : undefined,
      rentalDurationMonths: editFormData.rentalDurationMonths ? Number(editFormData.rentalDurationMonths) : undefined,
      availableFrom: editFormData.availableFrom ? new Date(editFormData.availableFrom).toISOString() : undefined,
    };
    // Remove unused subcategories
    ["roomSubcategory", "apartmentSubcategory", "pgSubcategory", "otherSubcategory"].forEach(f => {
      if (f !== subcategoryField) delete submitData[f];
    });

    console.log('propertyType before update:', typeof submitData.propertyType, submitData.propertyType);
    console.log('propertyType in payload:', submitData.propertyType, typeof submitData.propertyType);
    console.log('Submitting property update payload:', submitData);
    try {
      const res = await axios.put(`/api/properties/${editingProperty._id}`, submitData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Property updated successfully!");
      setEditingProperty(null);
    } catch (err) {
      console.error("Update error:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Request data:", err.request);
      } else {
        // Something happened in setting up the request
        console.error("Error message:", err.message);
      }
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      }
    }
    // Reset click count after update
    setUpdateClickCount(0);
  };

  // Render the correct step
  let stepComponent;
  if (step === 1) {
    stepComponent = (
      <PropertyFormStep1
        editFormData={editFormData}
        handleEditFormChange={handleEditFormChange}
        handleMultiSelect={handleMultiSelect}
        validationErrors={validationErrors}
      />
    );
  } else if (step === 2) {
    stepComponent = (
      <PropertyFormStep2
        editFormData={editFormData}
        handleEditFormChange={handleEditFormChange}
        handleMultiSelect={handleMultiSelect}
        validationErrors={validationErrors}
      />
    );
  } else if (step === 3) {
    stepComponent = (
      <PropertyFormStep3
        editFormData={editFormData}
        handleEditFormChange={handleEditFormChange}
        handleMultiSelect={handleMultiSelect}
        validationErrors={validationErrors}
      />
    );
  } else if (step === 4) {
    stepComponent = (
      <PropertyFormStep4
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        previewImages={previewImages}
        setPreviewImages={setPreviewImages}
        previewVideos={previewVideos}
        setPreviewVideos={setPreviewVideos}
        validationErrors={validationErrors}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto py-10">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] rounded-xl shadow-lg overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-slate-800">Edit Property</h2>
          <button
            onClick={() => setEditingProperty(null)}
            className="text-3xl font-semibold text-slate-500 hover:text-slate-700 transition"
            title="Close"
          >
            &times;
          </button>
        </div>

        {/* Step Indicator */}
        <ProgressIndicator step={step} setStep={setStep} editFormData={editFormData} />

        {/* Form */}
        <form onSubmit={step === 4 ? handlePropertyUpdate : (e) => e.preventDefault()}>
          {stepComponent}

          {/* Footer */}
          <div className="flex justify-between items-center mt-8 pt-5 border-t border-slate-300">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="flex items-center px-4 py-2 bg-slate-200 hover:bg-slate-300 text-indigo-700 rounded-md transition"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (validateStep(step)) setStep(prev => prev + 1);
                }}
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
              >
                Next <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
              >
                <FaCheck className="mr-2" /> Update Property
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyModal;
