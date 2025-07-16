const Step2 = ({ formData, handleChange, handleMultiSelect, validationErrors }) => {
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
        
          // Grouped property type options
          const propertyTypeGroups = [
            {
              group: 'Rooms',
              options: [
                { display: 'Independent Room', value: 'independent room' },
                { display: 'Shared Room', value: 'shared room' },
                { display: 'Coed', value: 'Coed' },
              ],
            },
            {
              group: 'Apartments',
              options: [
                { display: '1BHK Flat', value: '1bhk flat' },
                { display: '2BHK Flat', value: '2bhk flat' },
                { display: '&Above', value: '&Above' },
              ],
            },
            {
              group: 'PG/Hostels',
              options: [
                { display: 'PG for Boys', value: 'pg for boys' },
                { display: 'PG for Girls', value: 'pg for girls' },
                { display: 'Coed', value: 'Coed' },
              ],
            },
            {
              group: 'Others',
              options: [
                { display: 'Farm House', value: 'farm house' },
                { display: 'Villa', value: 'villa' },
                { display: 'Studio Apartment', value: 'studio apartment' },
                { display: 'Commerical', value: 'Commerical' },
              ],
            },
          ];
        
          // Property type options
          const propertyTypeOptions = [
            { label: 'Room', value: 'room' },
            { label: 'Apartment', value: 'apartment' },
            { label: 'PG', value: 'pg' },
            { label: 'Other', value: 'other' },
          ];

          // Subcategory options
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
        
          return (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm">
                <label className="block font-semibold text-slate-700 text-sm mb-1">
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
        
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-bold text-purple-800 mb-1">
                  Nearby Places
                </label>
                <div className="">
                  <label className="inline-flex items-center cursor-pointer mb-2 font-medium text-purple-800">
                    <input
                      type="checkbox"
                      checked={formData.nearby.length === 6}
                      onChange={() => {
                        const allPlaces = [
                          "Hospital",
                          "Mall",
                          "Market",
                          "Railway Station",
                          "Airport",
                          "School",
                        ];
                        if (formData.nearby.length === 6) {
                          handleChange({ target: { name: "nearby", value: [] } });
                        } else {
                          handleChange({
                            target: {
                              name: "nearby",
                              value: allPlaces.map((place) => ({
                                name: place,
                                distance: "",
                                unit: "km",
                              })),
                            },
                          });
                        }
                      }}
                      className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                    />
                    <span className="ml-2 text-sm font-bold text-purple-800">Select All</span>
                  </label>

                  <div className="flex flex-wrap gap-4 mt-2">
                    {[
                      "Hospital",
                      "Mall",
                      "Market",
                      "Railway Station",
                      "Airport",
                      "School",
                    ].map((place) => (
                      <div key={place} className={`inline-flex flex-col items-start bg-white border border-purple-200 rounded-md px-3 py-2 shadow-sm hover:shadow-md transition-all ${formData.nearby.some((item) => item.name === place) ? 'bg-purple-100' : ''}`}>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.nearby.some((item) => item.name === place)}
                            onChange={(e) => {
                              const newNearby = e.target.checked
                                ? [
                                    ...formData.nearby,
                                    { name: place, distance: "", unit: "km" },
                                  ]
                                : formData.nearby.filter((item) => item.name !== place);
                              handleChange({ target: { name: "nearby", value: newNearby } });
                            }}
                            className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                          />
                          <label className="ml-2 text-sm text-purple-800 font-medium">{place}</label>
                        </div>
                        {formData.nearby.some((item) => item.name === place) && (
                          <div className="flex items-center mt-1 ml-6">
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={formData.nearby.find((item) => item.name === place)?.distance || ""}
                              onChange={(e) => {
                                const updatedNearby = formData.nearby.map((item) =>
                                  item.name === place
                                    ? { ...item, distance: e.target.value }
                                    : item
                                );
                                handleChange({ target: { name: "nearby", value: updatedNearby } });
                              }}
                              className="w-16 p-1 border border-purple-300 rounded-md text-sm"
                              placeholder="Distance"
                            />
                            <select
                              value={formData.nearby.find((item) => item.name === place)?.unit || "km"}
                              onChange={(e) => {
                                const updatedNearby = formData.nearby.map((item) =>
                                  item.name === place
                                    ? { ...item, unit: e.target.value }
                                    : item
                                );
                                handleChange({ target: { name: "nearby", value: updatedNearby } });
                              }}
                              className="ml-2 p-1 border border-purple-300 rounded-md text-sm"
                            >
                              <option value="km">km</option>
                              <option value="m">m</option>
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
        
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
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
        
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
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
                    {facingDirections.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
        
              {/* Property Type (single select) */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
                <label className="block font-semibold text-slate-700 text-sm mb-1">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md text-purple-800 cursor-pointer"
                  required
                >
                  <option value="">Select Property Type</option>
                  {propertyTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {validationErrors.propertyType && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.propertyType}</p>
                )}
              </div>

              {/* Subcategory fields (conditional) */}
              {formData.propertyType === 'room' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
                  <label className="block font-semibold text-slate-700 text-sm mb-1">
                    Room Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="roomSubcategory"
                    value={formData.roomSubcategory}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md text-purple-800 cursor-pointer"
                    required
                  >
                    <option value="">Select Room Subcategory</option>
                    {roomSubcategories.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
              {formData.propertyType === 'apartment' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
                  <label className="block font-semibold text-slate-700 text-sm mb-1">
                    Apartment Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="apartmentSubcategory"
                    value={formData.apartmentSubcategory}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md text-purple-800 cursor-pointer"
                    required
                  >
                    <option value="">Select Apartment Subcategory</option>
                    {apartmentSubcategories.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
              {formData.propertyType === 'pg' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
                  <label className="block font-semibold text-slate-700 text-sm mb-1">
                    PG Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="pgSubcategory"
                    value={formData.pgSubcategory}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md text-purple-800 cursor-pointer"
                    required
                  >
                    <option value="">Select PG Subcategory</option>
                    {pgSubcategories.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
              {formData.propertyType === 'other' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
                  <label className="block font-semibold text-slate-700 text-sm mb-1">
                    Other Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="otherSubcategory"
                    value={formData.otherSubcategory}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border border-purple-800 outline-none rounded-md text-purple-800 cursor-pointer"
                    required
                  >
                    <option value="">Select Other Subcategory</option>
                    {otherSubcategories.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
        
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
                <label className="block text-sm font-bold text-purple-800 mb-1">
                  Furnish Type
                </label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {furnishOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`inline-flex items-center cursor-pointer border border-purple-200 rounded-md px-3 py-2 shadow-sm hover:shadow-md transition-all bg-white ${formData.furnishType.includes(option.value) ? 'bg-purple-100' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.furnishType.includes(option.value)}
                        onChange={() => handleMultiSelect("furnishType", option.value)}
                        className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                      />
                      <span className="ml-2 text-sm text-purple-800 font-medium">{option.display}</span>
                    </label>
                  ))}
                </div>
                {validationErrors.furnishType && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.furnishType}</p>
                )}
              </div>
        
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
                <label className="block text-sm font-bold text-purple-800 mb-1">
                  Additional Features
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {[
                    { field: "balcony", label: "Balcony" },
                    { field: "petsFriendly", label: "Pet Fridenly" },
                    { field: "nonVegAllowed", label: "Non-Veg Allowed" },
                    { field: "smokingAllowed", label: "Smoking Allowed" },
                    { field: "bachelorAllowed", label: "Bachelor Allowed" },
                  ].map(({ field, label }) => (
                    <label key={field} className={`inline-flex items-center cursor-pointer border border-purple-200 rounded-md px-3 py-2 shadow-sm hover:shadow-md transition-all bg-white ${formData[field] ? 'bg-purple-100' : ''}`}>
                      <input
                        type="checkbox"
                        checked={formData[field]}
                        onChange={handleChange}
                        name={field}
                        className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                      />
                      <span className="ml-2 text-sm text-purple-800 font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        };
        
        export default Step2;