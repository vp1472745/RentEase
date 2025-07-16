const Step3 = ({
          formData,
          handleChange,
          handleMultiSelect,
          validationErrors,
          facilityOptions
        }) => {
          return (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Pricing & Facilities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₹)*</label>
                  <input
                    type="number"
                    name="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {validationErrors.monthlyRent && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.monthlyRent}</p>
                  )}
                </div>
        
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)*</label>
                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {validationErrors.securityDeposit && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.securityDeposit}</p>
                  )}
                </div>
              </div>
        
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available From*</label>
                  <input
                    type="date"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {validationErrors.availableFrom && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.availableFrom}</p>
                  )}
                </div>
        
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stay (months)</label>
                  <input
                    type="number"
                    name="rentalDurationMonths"
                    value={formData.rentalDurationMonths}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
        
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Charges (₹/month)</label>
                <input
                  type="number"
                  name="maintenanceCharges"
                  value={formData.maintenanceCharges}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
        
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {facilityOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(option.value)}
                        onChange={() => handleMultiSelect("facilities", option.value)}
                        className="h-4 w-4 text-purple-800 rounded"
                      />
                      <span>{option.display}</span>
                    </label>
                  ))}
                </div>
              </div>
        
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parking</label>
                  <select
                    name="parking"
                    value={formData.parking}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Parking Type</option>
                    <option value="None">None</option>
                    <option value="Street">Street Parking</option>
                    <option value="Allocated">Allocated Parking</option>
                    <option value="Garage">Garage</option>
                  </select>
                </div>
        
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Water Supply</label>
                  <select
                    name="waterSupply"
                    value={formData.waterSupply}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Water Supply</option>
                    <option value="Corporation">Corporation Water</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
        
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Electricity Backup</label>
                <select
                  name="electricityBackup"
                  value={formData.electricityBackup}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Backup</option>
                  <option value="None">None</option>
                  <option value="Inverter">Inverter</option>
                  <option value="Generator">Generator</option>
                </select>
              </div>
            </div>
          );
        };
        
        export default Step3;