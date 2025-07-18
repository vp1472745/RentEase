import React from "react";

const PropertyFormStep2 = ({
  editFormData,
  handleEditFormChange,
  handleMultiSelect,
  validationErrors,
}) => {
  const furnishOptions = [
    { display: "Fully Furnished", value: "fully furnished" },
    { display: "Semi Furnished", value: "semi furnished" },
    { display: "Unfurnished", value: "unfurnished" },
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

  const propertyTypeOptions = [
    { label: "Room", value: "room" },
    { label: "Apartment", value: "apartment" },
    { label: "PG", value: "pg" },
    { label: "Other", value: "other" },
  ];

  const roomSubcategories = [
    { label: "Independent Room", value: "independent room" },
    { label: "Shared Room", value: "shared room" },
    { label: "Coed", value: "coed" },
  ];
  const apartmentSubcategories = [
    { label: "1BHK", value: "1BHK" },
    { label: "2BHK", value: "2BHK" },
    { label: "3BHK & above", value: "3BHK & above" },
  ];
  const pgSubcategories = [
    { label: "PG for boys", value: "PG for boys" },
    { label: "PG for girls", value: "PG for girls" },
    { label: "Coed", value: "coed" },
  ];
  const otherSubcategories = [
    { label: "Farm House", value: "farm house" },
    { label: "Villa", value: "villa" },
    { label: "Studio Apartment", value: "studio apartment" },
    { label: "Commercial", value: "commercial" },
  ];

  const handleEditFormChangeDefensive = (e) => {
    const { name, value } = e.target;
    if (name === "propertyType") {
      handleEditFormChange({
        target: { name: "propertyType", value: String(value) },
      });
      // Reset all subcategories
      [
        "roomSubcategory",
        "apartmentSubcategory",
        "pgSubcategory",
        "otherSubcategory",
      ].forEach((field) =>
        handleEditFormChange({ target: { name: field, value: "" } })
      );
    } else {
      handleEditFormChange(e);
    }
  };

  const allNearbyPlaces = [
    "Hospital",
    "Mall",
    "Market",
    "Railway Station",
    "Airport",
    "School",
  ];

  const additionalFeatures = [
    { field: "balcony", label: "Balcony" },
    { field: "petsFriendly", label: "Pet Friendly" },
    { field: "nonVegAllowed", label: "Non-Veg Allowed" },
    { field: "smokingAllowed", label: "Smoking Allowed" },
    { field: "bachelorAllowed", label: "Bachelor Allowed" },
  ];

  return (
    <div className="space-y-8 bg-white p-6 rounded-xl  border border-gray-100">
      {/* Area */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Area (sq. ft) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="area"
            value={editFormData.area}
            onChange={handleEditFormChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-700"
            required
            min="50"
            max="10000"
            placeholder="e.g. 1200"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            sq.ft
          </span>
        </div>
        {validationErrors.area && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.area}</p>
        )}
      </div>

      {/* Nearby Places */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Nearby Places
        </label>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={editFormData.nearby.length === allNearbyPlaces.length}
            onChange={() => {
              const allPlaces = allNearbyPlaces.map((place) => ({
                name: place,
                distance: "",
                unit: "km",
              }));
              handleEditFormChange({
                target: {
                  name: "nearby",
                  value:
                    editFormData.nearby.length === allNearbyPlaces.length
                      ? []
                      : allPlaces,
                },
              });
            }}
            className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
            Select All
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allNearbyPlaces.map((place) => {
            const isSelected = editFormData.nearby.some(
              (item) => item.name === place
            );
            const selectedItem = editFormData.nearby.find(
              (item) => item.name === place
            );
            return (
              <div
                key={place}
                className={`rounded-lg border p-3 transition-all duration-150 ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const newNearby = e.target.checked
                          ? [
                              ...editFormData.nearby,
                              { name: place, distance: "", unit: "km" },
                            ]
                          : editFormData.nearby.filter(
                              (item) => item.name !== place
                            );
                        handleEditFormChange({
                          target: { name: "nearby", value: newNearby },
                        });
                      }}
                      className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                    />
                    <label className="ml-2 text-sm text-gray-700 font-medium">
                      {place}
                    </label>
                  </div>
                  {isSelected && (
                    <div className="flex items-center ml-2">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={selectedItem?.distance || ""}
                        onChange={(e) => {
                          const updatedNearby = editFormData.nearby.map(
                            (item) =>
                              item.name === place
                                ? { ...item, distance: e.target.value }
                                : item
                          );
                          handleEditFormChange({
                            target: { name: "nearby", value: updatedNearby },
                          });
                        }}
                        className="w-16 p-1.5 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Distance"
                      />
                      <select
                        value={selectedItem?.unit || "km"}
                        onChange={(e) => {
                          const updatedNearby = editFormData.nearby.map(
                            (item) =>
                              item.name === place
                                ? { ...item, unit: e.target.value }
                                : item
                          );
                          handleEditFormChange({
                            target: { name: "nearby", value: updatedNearby },
                          });
                        }}
                        className="ml-2 p-1.5 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="km">km</option>
                        <option value="m">m</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floor Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Floor Number
          </label>
          <input
            type="number"
            name="floorNumber"
            value={editFormData.floorNumber}
            onChange={handleEditFormChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            min="0"
            placeholder="e.g. 3"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Total Floors
          </label>
          <input
            type="number"
            name="totalFloors"
            value={editFormData.totalFloors}
            onChange={handleEditFormChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            min="1"
            placeholder="e.g. 10"
          />
        </div>
      </div>

      {/* Age & Facing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Age of Property (years)
          </label>
          <input
            type="number"
            name="ageOfProperty"
            value={editFormData.ageOfProperty}
            onChange={handleEditFormChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            min="0"
            placeholder="e.g. 5"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Facing Direction
          </label>
          <select
            name="facingDirection"
            value={editFormData.facingDirection}
            onChange={handleEditFormChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-700"
          >
            <option value="">Select Direction</option>
            {facingDirections.map((dir) => (
              <option key={dir} value={dir}>
                {dir}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Property Type <span className="text-red-500">*</span>
        </label>
        <select
          name="propertyType"
          value={editFormData.propertyType}
          onChange={handleEditFormChangeDefensive}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-700"
          required
        >
          <option value="">Select Property Type</option>
          {propertyTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {validationErrors.propertyType && (
          <p className="text-red-500 text-xs mt-1">
            {validationErrors.propertyType}
          </p>
        )}
      </div>

      {/* Subcategories */}
      {editFormData.propertyType === "room" && (
        <SubcategorySelect
          name="roomSubcategory"
          label="Room Subcategory"
          options={roomSubcategories}
          value={editFormData.roomSubcategory}
          onChange={handleEditFormChange}
        />
      )}
      {editFormData.propertyType === "apartment" && (
        <SubcategorySelect
          name="apartmentSubcategory"
          label="Apartment Subcategory"
          options={apartmentSubcategories}
          value={editFormData.apartmentSubcategory}
          onChange={handleEditFormChange}
        />
      )}
      {editFormData.propertyType === "pg" && (
        <SubcategorySelect
          name="pgSubcategory"
          label="PG Subcategory"
          options={pgSubcategories}
          value={editFormData.pgSubcategory}
          onChange={handleEditFormChange}
        />
      )}
      {editFormData.propertyType === "other" && (
        <SubcategorySelect
          name="otherSubcategory"
          label="Other Subcategory"
          options={otherSubcategories}
          value={editFormData.otherSubcategory}
          onChange={handleEditFormChange}
        />
      )}

      {/* Furnish Type */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Furnish Type
        </label>
        <div className="flex flex-wrap gap-3">
          {furnishOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                editFormData.furnishType.includes(option.value)
                  ? "bg-indigo-50 border-indigo-300 "
                  : "bg-white border-gray-200 hover:border-purple-200"
              }`}
            >
              <input
                type="checkbox"
                checked={editFormData.furnishType.includes(option.value)}
                onChange={() => handleMultiSelect("furnishType", option.value)}
                className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
              />
              <span className="text-sm text-gray-700">{option.display}</span>
            </label>
          ))}
        </div>
        {validationErrors.furnishType && (
          <p className="text-red-500 text-xs mt-1">
            {validationErrors.furnishType}
          </p>
        )}
      </div>

      {/* Additional Features */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Additional Features
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {additionalFeatures.map(({ field, label }) => (
            <label
              key={field}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                editFormData[field]
                  ? "bg-indigo-50 border-indigo-300 "
                  : "bg-white border-gray-200 hover:border-purple-200"
              }`}
            >
              <input
                type="checkbox"
                checked={editFormData[field]}
                onChange={handleEditFormChange}
                name={field}
                className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// Subcategory Select Helper Component
const SubcategorySelect = ({ name, label, options, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-700"
      required
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default PropertyFormStep2;
