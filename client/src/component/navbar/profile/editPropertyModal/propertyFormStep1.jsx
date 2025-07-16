import { FaCamera } from "react-icons/fa";
import { BsFillMicFill, BsStopFill } from "react-icons/bs";

const PropertyFormStep1 = ({ editFormData, handleEditFormChange, handleMultiSelect, validationErrors }) => {
  const genderOptions = ["Couple Friendly", "Family", "Student", "Working professional", "Single"];

  const currentGender = Array.isArray(editFormData.Gender) ? editFormData.Gender : [];

  const inputFields = [
    { field: "description", label: "Description", type: "textarea", required: true },
    { field: "address", label: "Full Address", type: "text", required: true },
    { field: "city", label: "City", type: "text", required: true },
    { field: "state", label: "State", type: "text", required: true },
    { field: "popularLocality", label: "Popular Locality", type: "text", required: false },
    { field: "ownerName", label: "Owner Name", type: "text", required: true },
    { field: "ownerphone", label: "Owner Phone", type: "tel", required: true },
  ];

  return (
    <div className="space-y-6 text-sm text-gray-800">
      {inputFields.map(({ field, label, type, required }) => (
        <div key={field}>
          <label className="block text-sm font-semibold text-indigo-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {type === "textarea" ? (
            <textarea
              name={field}
              value={editFormData[field] || ""}
              onChange={handleEditFormChange}
              rows={4}
              className="w-full border border-indigo-500 p-3 rounded-md outline-none focus:ring focus:ring-indigo-300"
              required={required}
            />
          ) : (
            <input
              type={type}
              name={field}
              value={editFormData[field] || ""}
              onChange={handleEditFormChange}
              minLength={field === "ownerphone" ? 10 : 3}
              maxLength={field === "ownerphone" ? 15 : undefined}
              className="w-full border border-indigo-500 p-3 rounded-md outline-none focus:ring focus:ring-indigo-300"
              required={required}
            />
          )}
          {validationErrors[field] && (
            <p className="text-red-600 mt-1">{validationErrors[field]}</p>
          )}
        </div>
      ))}

      {/* Gender Selection */}
      <div>
        <label className="block text-sm font-semibold text-indigo-700 mb-1">
          Tenant Preference <span className="text-red-500">*</span>
        </label>

        <label className="inline-flex items-center space-x-2 mb-3">
          <input
            type="checkbox"
            checked={currentGender.length === genderOptions.length}
            onChange={() => {
              handleMultiSelect(
                "Gender",
                currentGender.length === genderOptions.length ? [] : [...genderOptions]
              );
            }}
            className="text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-indigo-700">Select All</span>
        </label>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {genderOptions.map((option) => (
            <label key={option} className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentGender.includes(option)}
                onChange={() => handleMultiSelect("Gender", option)}
                className="text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-800">{option}</span>
            </label>
          ))}
        </div>

        {validationErrors.Gender && (
          <p className="text-red-600 mt-1">{validationErrors.Gender}</p>
        )}
      </div>
    </div>
  );
};

export default PropertyFormStep1;
