import { BsFillMicFill, BsStopFill } from "react-icons/bs";
import { useState, useEffect } from "react";

const Step1 = ({ formData, handleChange, handleMultiSelect, validationErrors }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const genderOptions = [
    "Couple Friendly",
    "Family",
    "Student",
    "Single",
    "Working professional",
  ];

  const descriptionTemplates = [
    {
      label: 'PG Property Description Template',
      value: 'PG Accommodation Available: [PG Name or Landmark]\nLocation: [Full Address], [City]\nA safe and well-connected locality.\n\nRoom Type: [Single/Double Occupancy] – Ideal for [Students/Working Professionals]\n\nFacilities:\n- Well-ventilated rooms with attached washroom\n- Furnished with bed, table, chair, and wardrobe\n- Electricity and water charges included\n- High-speed Wi-Fi\n- Laundry service available\n- Nutritious meals provided (if applicable)\n- Peaceful, family-friendly environment\n\nRent: ₹[Amount] per month\nAdvance: [Advance Amount] | No brokerage\n\nIdeal For: [Boys/Girls/All] – [Students/Working Professionals]',
    },
    {
      label: 'Room for Rent Description Template',
      value:'Room for Rent near [Landmark/Society Name]\nLocation: [Full Address], [City]\n\nRoom Type: [Private/Shared Room] with [Attached/Shared Washroom]\nPerfect for [Students/Working Individuals]\n\nFeatures:\n- Bright, well-ventilated room\n- Basic furniture: bed, table, wardrobe\n- Electricity and water included\n- Optional: Wi-Fi, air conditioning\n- Peaceful environment with easy access to transport and markets\n\nRent: ₹[Amount] per month\nAdvance: [Advance Amount] | No brokerage\n\nAvailable For: [Boys/Girls/All] – [Short/Long Term Stay]'
    },
    {
      label: 'Flat for Rent Description Template',
      value: ` [2BHK/3BHK/etc.] Flat for Rent in [Building/Society Name]\nLocation: [Full Address], [City]\n\nHighlights:\n- [Furnished/Semi-Furnished/Unfurnished]\n- [Number] bedrooms, [Number] bathrooms, balcony, modular kitchen\n- 24x7 water and electricity supply\n- Security, lift, and parking available\n- Close to schools, hospitals, and public transport\n\nRent: ₹[Amount] per month\nSecurity Deposit: ₹[Deposit Amount] | Maintenance: ₹[If any]\n\nIdeal For: [Family/Working Professionals/Students]`,
    },
  ];

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const sr = new window.webkitSpeechRecognition();
    sr.continuous = true;
    sr.interimResults = true;
    sr.lang = "en-US";

    sr.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      if (transcript) {
        handleChange({
          target: {
            name: "description",
            value: formData.description + " " + transcript,
          },
        });
      }
    };

    sr.onerror = () => setIsListening(false);
    sr.onend = () => isListening && sr.start();

    setRecognition(sr);
    return () => sr.stop();
  }, [isListening, formData.description]);

  const toggleMic = () => {
    if (!recognition) return;
    isListening ? recognition.stop() : recognition.start();
    setIsListening(!isListening);
  };

  const inputFields = [
    { field: "address", label: "Full Address", required: true },
    { field: "city", label: "City", required: true },
    { field: "state", label: "State", required: true },
    { field: "popularLocality", label: "Popular Locality" },
    { field: "ownerName", label: "Owner Name", required: true },
    { field: "ownerphone", label: "Owner Phone", required: true },
  ];

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      {inputFields.map(({ field, label, required }) => (
        <div
          key={field}
          className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm"
        >
          <label className="block font-semibold text-slate-700 text-sm mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type={field === "ownerphone" ? "tel" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required={required}
            minLength={field === "ownerphone" ? 10 : 3}
            maxLength={field === "ownerphone" ? 15 : undefined}
            className="mt-1 w-full p-3 border border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          {validationErrors[field] && (
            <p className="text-sm text-red-600 mt-1">{validationErrors[field]}</p>
          )}
        </div>
      ))}

      {/* Description Template Dropdown */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm">
        <label className="block font-semibold text-slate-700 mb-2">
          Description Template
        </label>
        <select
          className="w-full p-3 border border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedTemplate}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedTemplate(val);
            handleChange({
              target: {
                name: "description",
                value: descriptionTemplates.find((t) => t.label === val)?.value || "",
              },
            });
          }}
        >
          <option value="">Select a description template...</option>
          {descriptionTemplates.map((tpl) => (
            <option key={tpl.label} value={tpl.label}>
              {tpl.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description Textarea with Speech-to-Text */}
      <div className="relative bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm">
        <label className="block font-semibold text-slate-700 mb-2">
          Property Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          required
          className="w-full p-4 border border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        <button
          type="button"
          onClick={toggleMic}
          title={isListening ? "Stop Recording" : "Start Recording"}
          className={`absolute bottom-4 right-4 p-2 rounded-full text-white ${
            isListening ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"
          } transition`}
        >
          {isListening ? <BsStopFill size={16} /> : <BsFillMicFill size={16} />}
        </button>
        {validationErrors.description && (
          <p className="text-sm text-red-600 mt-1">{validationErrors.description}</p>
        )}
        {isListening && (
          <p className="text-sm text-indigo-700 mt-2 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
            Listening...
          </p>
        )}
      </div>

      {/* Gender Preference */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm">
        <label className="block font-semibold text-slate-700 mb-2">
          Tenant Preference <span className="text-red-500">*</span>
        </label>
        <label className="inline-flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={formData.Gender.length === genderOptions.length}
            onChange={() =>
              handleChange({
                target: {
                  name: "Gender",
                  value:
                    formData.Gender.length === genderOptions.length ? [] : [...genderOptions],
                },
              })
            }
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-slate-800">Select All</span>
        </label>

        <div className="flex flex-wrap gap-3">
          {genderOptions.map((option) => (
            <label
              key={option}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border ${
                formData.Gender.includes(option)
                  ? "bg-indigo-100 border-indigo-600"
                  : "bg-white border-gray-300"
              } transition shadow-sm hover:shadow-md`}
            >
              <input
                type="checkbox"
                checked={formData.Gender.includes(option)}
                onChange={() => handleMultiSelect("Gender", option)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-800">{option}</span>
            </label>
          ))}
        </div>
        {validationErrors.Gender && (
          <p className="text-sm text-red-600 mt-1">{validationErrors.Gender}</p>
        )}
      </div>
    </div>
  );
};

export default Step1;
