import { RiLogoutCircleRLine } from "react-icons/ri";

const ProfileHeader = ({ name, handleLogout }) => {
  return (
    <>
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-mono h-18"></div>
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 sm:py-7 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Room Milega Dashboard
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600">
                Welcome back, {name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-red-600 transition-colors rounded"
              >
                <RiLogoutCircleRLine className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;