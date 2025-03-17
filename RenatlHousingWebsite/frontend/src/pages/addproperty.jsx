import { useState } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const AddProperty = () => {
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
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);

  const propertyOptions = ["Apartment", "Independent Floor", "Independent House", "Farm House"];
  const bhkOptions = ["1RK", "1BHK", "1.5BHK", "2BHK", "3+BHK"];
  const furnishOptions = ["Fully Furnished", "Semi Furnished", "Unfurnished"];
  const facilityOptions = ["Electricity", "WiFi", "Water Supply", "Parking", "Security", "Lift", "Gym", "Swimming Pool"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prevData) => {
      const currentArray = Array.isArray(prevData[field]) ? prevData[field] : [];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
  
      return { ...prevData, [field]: updatedArray };
    });
  };
  

  const handleImageUpload = async (event) => {
    const uploadData = new FormData();
    for (let i = 0; i < event.target.files.length; i++) {
      uploadData.append("images", event.target.files[i]);
    }

    try {
      setUploading(true);
      const res = await axios.post("/api/properties/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...res.data.imageUrls],
      }));

      setPreviewImages([...previewImages, ...res.data.imageUrls]);
      setUploading(false);
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const submitData = new FormData();

  Object.keys(formData).forEach((key) => {
    const value = formData[key];
    if (Array.isArray(value)) {
      value.forEach((item) => submitData.append(`${key}[]`, item));
    } else if (value) {
      submitData.append(key, value);
    }
  });

  try {
    const response = await fetch(`${API_BASE_URL}http://localhost:5000`, {
      method: "POST",
      body: submitData,
      headers: { Authorization: `Bearer ${userToken}` },
      
      
    });
   
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      throw new Error(`❌ Error: ${response.status} ${response.statusText}`);
      
    }
   
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("✅ Property added successfully:", data);
    } else {
      throw new Error("❌ Received non-JSON response. Check API endpoint.");
    }
  } catch (error) {
    console.error("❌ Submission Error:", error);
    console.log("vv");
  }
};

  
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const totalFields = Object.keys(formData).length;
  const filledFields = Object.values(formData).filter((val) => Array.isArray(val) ? val.length > 0 : val.trim() !== "").length;
  const progress = (filledFields / totalFields) * 100;

  return (
    <div className="flex flex-col md:flex-row items-start justify-center  min-h-[90vh] p-6 bg-gray-100 mt-20 ">
      <div className="w-32 h-32 md:w-40 md:h-40 mb-6 md:mb-0 md:mr-10 self-start">
        <CircularProgressbar
          value={progress}
          text={`${Math.round(progress)}%`}
          styles={buildStyles({
            textColor: "#1D4ED8",
            pathColor: "#1D4ED8",
            trailColor: "#D1D5DB",
          })}
        />
      </div>

      <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Add Property - Step {step}</h2>
        <form onSubmit={handleSubmit}>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              {["title", "description", "address", "city", "state"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Property Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>
              {[
                { label: "Property Type", field: "propertyType", options: propertyOptions },
                { label: "BHK Type", field: "bhkType", options: bhkOptions },
                { label: "Furnish Type", field: "furnishType", options: furnishOptions },
              ].map(({ label, field, options }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option) => (
                      <label key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData[field].includes(option)}
                          onChange={() => handleMultiSelect(field, option)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Facilities & Rent */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Facilities</label>
                <div className="flex flex-wrap gap-2">
                  {facilityOptions.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(option)}
                        onChange={() => handleMultiSelect("facilities", option)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              {["monthlyRent", "securityDeposit", "rentalDurationMonths", "availableFrom"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Upload Images */}
          {step === 4 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {previewImages.map((src, index) => (
                  <img key={index} src={src} alt="preview" className="w-20 h-20 object-cover rounded-md border border-gray-300" />
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;