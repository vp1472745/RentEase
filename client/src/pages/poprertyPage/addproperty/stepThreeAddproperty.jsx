const Step3 = ({ formData, handleChange, handleMultiSelect, validationErrors }) => {
          const facilityOptions = [
            { display: "Electricity", value: "electricity" },
            { display: "WiFi", value: "wifi" },
            { display: "Water Supply", value: "water supply" },
            { display: "Parking", value: "parking" },
            { display: "Security", value: "security" },
            { display: "Lift", value: "lift" },
            { display: "Gym", value: "gym" },
            { display: "Swimming Pool", value: "swimming pool" },
          ];
        
          return (
            <div className="space-y-4 ">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
                <label className="block font-semibold text-slate-700 text-sm  mb-1">
                  Facilities
                </label>
                <label className={`inline-flex items-center cursor-pointer mb-2  text-slate-700 text-sm  bg-white border border-purple-200 rounded-md px-3 py-2 shadow-sm hover:shadow-md transition-all ${formData.facilities.length === facilityOptions.length ? 'bg-purple-100' : ''}`}>
                  <input
                    type="checkbox"
                    checked={formData.facilities.length === facilityOptions.length}
                    onChange={() => {
                      if (formData.facilities.length === facilityOptions.length) {
                        handleMultiSelect("facilities", "clear");
                      } else {
                        handleChange({ target: { name: "facilities", value: facilityOptions.map(opt => opt.value) } });
                      }
                    }}
                    className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                  />
                  <span className="ml-2 text-sm font-bold text-purple-800">Select All</span>
                </label>
        
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {facilityOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`inline-flex items-center cursor-pointer bg-white border border-purple-200 rounded-md px-3 py-2 shadow-sm hover:shadow-md transition-all ${formData.facilities.includes(option.value) ? 'bg-purple-100' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(option.value)}
                        onChange={() => handleMultiSelect("facilities", option.value)}
                        className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
                      />
                      <span className="ml-2 text-sm text-purple-800 font-medium">{option.display}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { field: "monthlyRent", label: "Monthly Rent (₹)", required: true },
                  { field: "securityDeposit", label: "Security Deposit (₹)", required: true },
                  { field: "rentalDurationMonths", label: "Minimum Stay (months)" },
                  { field: "maintenanceCharges", label: "Maintenance Charges (₹/month)" },
                ].map(({ field, label, required }) => (
                  <div key={field} className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-slate-700 text-sm mb-1">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
                      required={required}
                      min="0"
                      step={field.includes("Rent") ? "1000" : "100"}
                    />
                    {validationErrors[field] && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors[field]}</p>
                    )}
                  </div>
                ))}
              </div>
        
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
                  <label className="block font-semibold text-slate-700 text-sm mb-1">
                    Available From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer "
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {validationErrors.availableFrom && (
                
                    <p className="mt-1 text-sm text-red-600 ">
                      {validationErrors.availableFrom}
                    </p>
                  )}
                </div>
        
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
                  <label className="block font-semibold text-slate-700 text-sm mb-1">
                    Parking
                  </label>
                  <select
                    name="parking"
                    value={formData.parking}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
                  >
                    <option value="">Select Parking Type</option>
                    <option value="None">None</option>
                    <option value="Street">Street Parking</option>
                    <option value="Allocated">Allocated Parking</option>
                    <option value="Garage">Garage</option>
                  </select>
                </div>
              </div>
        
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
                  <label className="block font-semibold text-slate-700 text-sm mb-1">
                    Water Supply
                  </label>
                  <select
                    name="waterSupply"
                    value={formData.waterSupply}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
                  >
                    <option value="">Select Water Supply</option>
                    <option value="Corporation">Corporation Water</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
        
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
                  <label className="block font-semibold text-slate-700 text-sm mb-1">
                    Electricity Backup
                  </label>
                  <select
                    name="electricityBackup"
                    value={formData.electricityBackup}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
                  >
                    <option value="">Select Backup</option>
                    <option value="None">None</option>
                    <option value="Inverter">Inverter</option>
                    <option value="Generator">Generator</option>
                  </select>
                </div>
              </div>
            </div>
          );
        };
        
        export default Step3;