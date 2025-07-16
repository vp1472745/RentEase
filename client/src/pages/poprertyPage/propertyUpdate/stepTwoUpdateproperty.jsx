const Step2 = ({
          formData,
          handleChange,
          handleMultiSelect,
          validationErrors,
          propertyOptions,
          bhkOptions,
          furnishOptions,
          facingDirections
        }) => {
          return (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Property Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq. ft)*</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min="50"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                {validationErrors.area && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.area}</p>
                )}
              </div>
        
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type*</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {propertyOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.propertyType.includes(option.value)}
                        onChange={() => handleMultiSelect("propertyType", option.value)}
                        className="h-4 w-4 text-purple-800 rounded"
                      />
                      <span>{option.display}</span>
                    </label>
                  ))}
                </div>
                {validationErrors.propertyType && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.propertyType}</p>
                )}
              </div>
        
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BHK Type*</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {bhkOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.bhkType.includes(option.value)}
                        onChange={() => handleMultiSelect("bhkType", option.value)}
                        className="h-4 w-4 text-purple-800 rounded"
                      />
                      <span>{option.display}</span>
                    </label>
                  ))}
                </div>
                {validationErrors.bhkType && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.bhkType}</p>
                )}
              </div>
        
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Furnish Type*</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {furnishOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.furnishType.includes(option.value)}
                        onChange={() => handleMultiSelect("furnishType", option.value)}
                        className="h-4 w-4 text-purple-800 rounded"
                      />
                      <span>{option.display}</span>
                    </label>
                  ))}
                </div>
                {validationErrors.furnishType && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.furnishType}</p>
                )}
              </div>
        
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number</label>
                  <input
                    type="number"
                    name="floorNumber"
                    value={formData.floorNumber}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
        
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label>
                  <input
                    type="number"
                    name="totalFloors"
                    value={formData.totalFloors}
                    onChange={handleChange}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
        
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age of Property (years)</label>
                  <input
                    type="number"
                    name="ageOfProperty"
                    value={formData.ageOfProperty}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
        
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facing Direction</label>
                  <select
                    name="facingDirection"
                    value={formData.facingDirection}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Direction</option>
                    {facingDirections.map(dir => (
                      <option key={dir} value={dir}>{dir}</option>
                    ))}
                  </select>
                </div>
              </div>
        
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Features</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="balcony"
                      checked={formData.balcony}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-800 rounded"
                    />
                    <span>Balcony</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="petsAllowed"
                      checked={formData.petsAllowed}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-800 rounded"
                    />
                    <span>Pets Allowed</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="nonVegAllowed"
                      checked={formData.nonVegAllowed}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-800 rounded"
                    />
                    <span>Non-Veg Allowed</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="smokingAllowed"
                      checked={formData.smokingAllowed}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-800 rounded"
                    />
                    <span>Smoking Allowed</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="bachelorAllowed"
                      checked={formData.bachelorAllowed}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-800 rounded"
                    />
                    <span>Bachelor Allowed</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="coupleFriendly"
                      checked={formData.coupleFriendly}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-800 rounded"
                    />
                    <span>Couple Friendly</span>
                  </label>
                </div>
              </div>
            </div>
          );
        };
        
        export default Step2;