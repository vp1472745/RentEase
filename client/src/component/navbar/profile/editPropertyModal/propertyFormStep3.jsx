const PropertyFormStep3 = ({ editFormData, setEditFormData, validationErrors }) => {
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

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelect = (field, value) => {
    setEditFormData((prevData) => {
      const currentArray = Array.isArray(prevData[field]) ? prevData[field] : [];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return { ...prevData, [field]: updatedArray };
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-purple-800 mb-1">
          Facilities
        </label>

        {/* Select All checkbox */}
        <label className="inline-flex items-center cursor-pointer mb-2">
          <input
            type="checkbox"
            checked={editFormData.facilities.length === facilityOptions.length}
            onChange={() => {
              if (editFormData.facilities.length === facilityOptions.length) {
                setEditFormData((prev) => ({
                  ...prev,
                  facilities: [],
                }));
              } else {
                setEditFormData((prev) => ({
                  ...prev,
                  facilities: facilityOptions.map((option) => option.value),
                }));
              }
            }}
            className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
          />
          <span className="ml-2 text-sm font-bold text-purple-800">
            Select All
          </span>
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {facilityOptions.map((option) => (
            <label
              key={option.value}
              className="inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={editFormData.facilities.includes(option.value)}
                onChange={() => handleMultiSelect("facilities", option.value)}
                className="h-4 w-4 text-purple-800 border-purple-800 rounded focus:ring-purple-800 cursor-pointer checked:bg-purple-800"
              />
              <span className="ml-2 text-sm text-purple-800">
                {option.display}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            field: "monthlyRent",
            label: "Monthly Rent (₹)",
            required: true,
          },
          {
            field: "securityDeposit",
            label: "Security Deposit (₹)",
            required: true,
          },
          {
            field: "rentalDurationMonths",
            label: "Minimum Stay (months)",
          },
          {
            field: "maintenanceCharges",
            label: "Maintenance Charges (₹/month)",
          },
        ].map(({ field, label, required }) => (
          <div key={field}>
            <label className="block text-sm font-bold text-purple-800 mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              name={field}
              value={editFormData[field]}
              onChange={handleEditFormChange}
              className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
              required={required}
              min="0"
              step={field.includes("Rent") ? "1000" : "100"}
            />
            {validationErrors[field] && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors[field]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-purple-800 mb-1">
            Available From <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="availableFrom"
            value={editFormData.availableFrom}
            onChange={handleEditFormChange}
            className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
            required
            min={new Date().toISOString().split("T")[0]}
          />
          {validationErrors.availableFrom && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.availableFrom}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-purple-800 mb-1">
            Parking
          </label>
          <select
            name="parking"
            value={editFormData.parking}
            onChange={handleEditFormChange}
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
        <div>
          <label className="block text-sm font-bold text-purple-800 mb-1">
            Water Supply
          </label>
          <select
            name="waterSupply"
            value={editFormData.waterSupply}
            onChange={handleEditFormChange}
            className="mt-1 p-3 w-full border border-purple-800 rounded-md cursor-pointer"
          >
            <option value="">Select Water Supply</option>
            <option value="Corporation">Corporation Water</option>
            <option value="Borewell">Borewell</option>
            <option value="Both">Both</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-purple-800 mb-1">
            Electricity Backup
          </label>
          <select
            name="electricityBackup"
            value={editFormData.electricityBackup}
            onChange={handleEditFormChange}
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

export default PropertyFormStep3;