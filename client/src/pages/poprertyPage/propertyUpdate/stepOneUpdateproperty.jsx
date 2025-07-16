import { BsFillMicFill, BsStopFill } from "react-icons/bs";
import { FaPlus, FaMinus } from "react-icons/fa";

const Step1 = ({
  formData,
  newNearby,
  handleChange,
  handleNearbyChange,
  handleAddNearby,
  handleRemoveNearby,
  handleMultiSelect,
  validationErrors,
  isListening,
  startListening,
  stopListening,
  genderOptions,
  nearbyOptions,
  distanceUnits
}) => {
  return (
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
  );
};

export default Step1;