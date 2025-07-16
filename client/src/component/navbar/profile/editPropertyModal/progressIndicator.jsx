import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaCheck } from "react-icons/fa";

const ProgressIndicator = ({ step, setStep, editFormData }) => {
  const calculateProgress = () => {
    const stepDefinitions = [
      {
        fields: ["description", "address", "city", "state", "ownerName", "ownerphone", "Gender"],
        weight: 0.25,
      },
      {
        fields: ["area", "propertyType", "bhkType", "furnishType"],
        weight: 0.25,
      },
      {
        fields: ["monthlyRent", "securityDeposit", "availableFrom"],
        weight: 0.25,
      },
      {
        fields: ["images", "videos"],
        weight: 0.25,
      },
    ];

    let progress = 0;
    stepDefinitions.forEach(({ fields, weight }) => {
      const filled = fields.filter((field) => {
        const val = editFormData[field];
        if (Array.isArray(val)) return val.length > 0;
        if (typeof val === "string") return val.trim() !== "";
        if (typeof val === "number") return val > 0;
        if (typeof val === "boolean") return val === true;
        return false;
      }).length;

      progress += (filled / fields.length) * weight;
    });

    return Math.round(progress * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="hidden md:block w-full mb-8">
      {/* Circular Progress */}
      <div className="flex justify-center">
        <div className="w-28 h-28">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textColor: "#1e293b", // slate-800
              pathColor: "#6D28D9", // indigo-700
              trailColor: "#E5E7EB", // gray-200
              textSize: "18px",
            })}
          />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between mt-6 px-4">
        {[1, 2, 3, 4].map((num) => (
          <div
            key={num}
            onClick={() => setStep(num)}
            className={`flex flex-col items-center cursor-pointer transition duration-200 group ${
              step === num ? "bg-indigo-100 border-l-4 border-indigo-600 rounded-lg" : ""
            } p-2`}
          >
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-full mb-1 font-bold text-sm ${
                step > num
                  ? "bg-indigo-600 text-white"
                  : step === num
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step > num ? <FaCheck size={12} /> : num}
            </div>
            <span className="text-xs font-medium text-slate-700 text-center">
              {num === 1 && "Basic Info"}
              {num === 2 && "Details"}
              {num === 3 && "Facilities"}
              {num === 4 && "Media"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
