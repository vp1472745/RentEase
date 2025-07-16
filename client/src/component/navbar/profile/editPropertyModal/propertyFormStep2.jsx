import React from 'react';

const PropertyFormStep2 = ({
  editFormData,
  handleEditFormChange,
  handleMultiSelect,
  validationErrors
}) => {
  const furnishOptions = [
    { display: "Fully Furnished", value: "fully furnished" },
    { display: "Semi Furnished", value: "semi furnished" },
    { display: "Unfurnished", value: "unfurnished" },
  ];

  const facingDirections = [
    "North", "South", "East", "West",
    "North-East", "North-West", "South-East", "South-West"
  ];

  const propertyTypeOptions = [
    { label: 'Room', value: 'room' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'PG', value: 'pg' },
    { label: 'Other', value: 'other' },
  ];

  const roomSubcategories = [
    { label: 'Independent Room', value: 'independent room' },
    { label: 'Shared Room', value: 'shared room' },
    { label: 'Coed', value: 'coed' },
  ];
  const apartmentSubcategories = [
    { label: '1BHK', value: '1BHK' },
    { label: '2BHK', value: '2BHK' },
    { label: '3BHK & above', value: '3BHK & above' },
  ];
  const pgSubcategories = [
    { label: 'PG for boys', value: 'PG for boys' },
    { label: 'PG for girls', value: 'PG for girls' },
    { label: 'Coed', value: 'coed' },
  ];
  const otherSubcategories = [
    { label: 'Farm House', value: 'farm house' },
    { label: 'Villa', value: 'villa' },
    { label: 'Studio Apartment', value: 'studio apartment' },
    { label: 'Commercial', value: 'commercial' },
  ];

  const handleEditFormChangeDefensive = (e) => {
    const { name, value } = e.target;
    if (name === "propertyType") {
      handleEditFormChange({ target: { name: "propertyType", value: String(value) } });
      // Reset all subcategories
      ["roomSubcategory", "apartmentSubcategory", "pgSubcategory", "otherSubcategory"].forEach((field) =>
        handleEditFormChange({ target: { name: field, value: "" } })
      );
    } else {
      handleEditFormChange(e);
    }
  };

  const allNearbyPlaces = [
    "Hospital", "Mall", "Market", "Railway Station", "Airport", "School"
  ];

  return (
    <div className="space-y-4">
      {/* Area */}
      <div className="section">
        <label className="label-required">Area (sq. ft)</label>
        <input
          type="number"
          name="area"
          value={editFormData.area}
          onChange={handleEditFormChange}
          className="input"
          required
          min="50"
          max="10000"
        />
        {validationErrors.area && <p className="error">{validationErrors.area}</p>}
      </div>

      {/* Nearby Places */}
      <div className="section">
        <label className="label">Nearby Places</label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={editFormData.nearby.length === allNearbyPlaces.length}
            onChange={() => {
              const allPlaces = allNearbyPlaces.map((place) => ({
                name: place,
                distance: "",
                unit: "km"
              }));
              handleEditFormChange({
                target: {
                  name: "nearby",
                  value: editFormData.nearby.length === allNearbyPlaces.length ? [] : allPlaces,
                }
              });
            }}
            className="checkbox"
          />
          <span className="ml-2 text-sm font-bold text-purple-800">Select All</span>
        </label>

        <div className="flex flex-wrap gap-4 mt-2">
          {allNearbyPlaces.map((place) => {
            const isSelected = editFormData.nearby.some((item) => item.name === place);
            const selectedItem = editFormData.nearby.find((item) => item.name === place);
            return (
              <div
                key={place}
                className={`nearby-card ${isSelected ? 'bg-purple-100' : ''}`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const newNearby = e.target.checked
                        ? [...editFormData.nearby, { name: place, distance: "", unit: "km" }]
                        : editFormData.nearby.filter((item) => item.name !== place);
                      handleEditFormChange({ target: { name: "nearby", value: newNearby } });
                    }}
                    className="checkbox"
                  />
                  <label className="ml-2 text-sm text-purple-800 font-medium">{place}</label>
                </div>
                {isSelected && (
                  <div className="flex items-center mt-1 ml-6">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={selectedItem?.distance || ""}
                      onChange={(e) => {
                        const updatedNearby = editFormData.nearby.map((item) =>
                          item.name === place ? { ...item, distance: e.target.value } : item
                        );
                        handleEditFormChange({ target: { name: "nearby", value: updatedNearby } });
                      }}
                      className="w-16 p-1 border border-purple-300 rounded-md text-sm"
                      placeholder="Distance"
                    />
                    <select
                      value={selectedItem?.unit || "km"}
                      onChange={(e) => {
                        const updatedNearby = editFormData.nearby.map((item) =>
                          item.name === place ? { ...item, unit: e.target.value } : item
                        );
                        handleEditFormChange({ target: { name: "nearby", value: updatedNearby } });
                      }}
                      className="ml-2 p-1 border border-purple-300 rounded-md text-sm"
                    >
                      <option value="km">km</option>
                      <option value="m">m</option>
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floor Info */}
      <div className="form-grid">
        <div>
          <label className="label">Floor Number</label>
          <input
            type="number"
            name="floorNumber"
            value={editFormData.floorNumber}
            onChange={handleEditFormChange}
            className="input"
            min="0"
          />
        </div>
        <div>
          <label className="label">Total Floors</label>
          <input
            type="number"
            name="totalFloors"
            value={editFormData.totalFloors}
            onChange={handleEditFormChange}
            className="input"
            min="1"
          />
        </div>
      </div>

      {/* Age & Facing */}
      <div className="form-grid">
        <div>
          <label className="label">Age of Property (years)</label>
          <input
            type="number"
            name="ageOfProperty"
            value={editFormData.ageOfProperty}
            onChange={handleEditFormChange}
            className="input"
            min="0"
          />
        </div>
        <div>
          <label className="label">Facing Direction</label>
          <select
            name="facingDirection"
            value={editFormData.facingDirection}
            onChange={handleEditFormChange}
            className="input"
          >
            <option value="">Select Direction</option>
            {facingDirections.map((dir) => (
              <option key={dir} value={dir}>{dir}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Type */}
      <div className="section">
        <label className="label-required">Property Type</label>
        <select
          name="propertyType"
          value={editFormData.propertyType}
          onChange={handleEditFormChangeDefensive}
          className="input"
          required
        >
          <option value="">Select Property Type</option>
          {propertyTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {validationErrors.propertyType && (
          <p className="error">{validationErrors.propertyType}</p>
        )}
      </div>

      {/* Subcategories */}
      {editFormData.propertyType === 'room' && (
        <SubcategorySelect name="roomSubcategory" label="Room Subcategory" options={roomSubcategories} value={editFormData.roomSubcategory} onChange={handleEditFormChange} />
      )}
      {editFormData.propertyType === 'apartment' && (
        <SubcategorySelect name="apartmentSubcategory" label="Apartment Subcategory" options={apartmentSubcategories} value={editFormData.apartmentSubcategory} onChange={handleEditFormChange} />
      )}
      {editFormData.propertyType === 'pg' && (
        <SubcategorySelect name="pgSubcategory" label="PG Subcategory" options={pgSubcategories} value={editFormData.pgSubcategory} onChange={handleEditFormChange} />
      )}
      {editFormData.propertyType === 'other' && (
        <SubcategorySelect name="otherSubcategory" label="Other Subcategory" options={otherSubcategories} value={editFormData.otherSubcategory} onChange={handleEditFormChange} />
      )}

      {/* Furnish Type */}
      <div className="section">
        <label className="label">Furnish Type</label>
        <div className="flex flex-wrap gap-4 mt-2">
          {furnishOptions.map((option) => (
            <label key={option.value} className={`checkbox-card ${editFormData.furnishType.includes(option.value) ? 'bg-purple-100' : ''}`}>
              <input
                type="checkbox"
                checked={editFormData.furnishType.includes(option.value)}
                onChange={() => handleMultiSelect("furnishType", option.value)}
                className="checkbox"
              />
              <span className="ml-2 text-sm text-purple-800 font-medium">{option.display}</span>
            </label>
          ))}
        </div>
        {validationErrors.furnishType && <p className="error">{validationErrors.furnishType}</p>}
      </div>

      {/* Additional Features */}
      <div className="section">
        <label className="label">Additional Features</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {[
            { field: "balcony", label: "Balcony" },
            { field: "petsFriendly", label: "Pet Friendly" },
            { field: "nonVegAllowed", label: "Non-Veg Allowed" },
            { field: "smokingAllowed", label: "Smoking Allowed" },
            { field: "bachelorAllowed", label: "Bachelor Allowed" },
          ].map(({ field, label }) => (
            <label key={field} className={`checkbox-card ${editFormData[field] ? 'bg-purple-100' : ''}`}>
              <input
                type="checkbox"
                checked={editFormData[field]}
                onChange={handleEditFormChange}
                name={field}
                className="checkbox"
              />
              <span className="ml-2 text-sm text-purple-800 font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// Subcategory Select Helper
const SubcategorySelect = ({ name, label, options, value, onChange }) => (
  <div className="section">
    <label className="label-required">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="input"
      required
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

export default PropertyFormStep2;
