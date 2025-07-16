import { CiEdit } from "react-icons/ci";
import house from "../../../assets/house.png";

const ProfileSidebar = ({
  profileImage,
  name,
  email,
  phone,
  selectedSection,
  handleTabChange
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 sticky top-8">
        {/* Profile Card */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mt-4">{name}</h2>
          <p className="text-slate-500 text-sm">{email}</p>
          {phone && <p className="text-slate-400 text-sm mt-1">{phone}</p>}
        </div>

        {/* Sidebar Navigation */}
        <nav className="space-y-2">
          <button
            onClick={() => handleTabChange("editProfile")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              selectedSection === "editProfile"
                ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 shadow-sm"
                : "text-slate-700 hover:bg-slate-100 hover:text-indigo-600"
            }`}
          >
            <CiEdit className="w-5 h-5" />
            <span className="font-medium">Edit Profile</span>
          </button>

          <button
            onClick={() => handleTabChange("myProperties")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              selectedSection === "myProperties"
                ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 shadow-sm"
                : "text-slate-700 hover:bg-slate-100 hover:text-indigo-600"
            }`}
          >
            <img src={house} className="w-5 h-5" alt="My Properties Icon" />
            <span className="font-medium">My Properties</span>
          </button>

          <button
            onClick={() => handleTabChange("savedProperties")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              selectedSection === "savedProperties"
                ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 shadow-sm"
                : "text-slate-700 hover:bg-slate-100 hover:text-indigo-600"
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5v14l7-7 7 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
                />
              </svg>
            </span>
            <span className="font-medium">Saved Properties</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default ProfileSidebar;
