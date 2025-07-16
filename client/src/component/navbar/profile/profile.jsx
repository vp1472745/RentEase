import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileHeader from "../../navbar/profile/profileHeader.jsx";
import ProfileSidebar from "./profileSidebar";
import EditProfileForm from "./editProfileForm";
import MyProperties from "./myProperties";
import EditPropertyModal from "./editPropertyModal/editPropertyModal";
import SavedProperties from "./SavedProperties";

const Profile = () => {
  const [name, setName] = useState(localStorage.getItem("name") || "User Name");
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || "https://via.placeholder.com/100"
  );
  const [editingProperty, setEditingProperty] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tabFromURL = params.get("tab");
  const [selectedSection, setSelectedSection] = useState(tabFromURL || "editProfile");

  useEffect(() => {
    if (tabFromURL) {
      setSelectedSection(tabFromURL);
    }
  }, [tabFromURL, location]);

  const handleTabChange = (tabName) => {
    setSelectedSection(tabName);
    navigate(`/profile?tab=${tabName}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("phone");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <>
      <ProfileHeader name={name} handleLogout={handleLogout} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <ProfileSidebar
              profileImage={profileImage}
              name={name}
              email={localStorage.getItem("email") || "user@example.com"}
              phone={localStorage.getItem("phone") || ""}
              selectedSection={selectedSection}
              handleTabChange={handleTabChange}
            />

            <div className="lg:col-span-3">
              <div className="bg-white border border-indigo-100 rounded-xl shadow-md overflow-hidden transition-all duration-300">
                {selectedSection === "myProperties" ? (
                  <MyProperties setEditingProperty={setEditingProperty} />
                ) : selectedSection === "savedProperties" ? (
                  <SavedProperties />
                ) : (
                  <EditProfileForm
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    name={name}
                    setName={setName}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {editingProperty && (
          <EditPropertyModal
            editingProperty={editingProperty}
            setEditingProperty={setEditingProperty}
          />
        )}
      </div>
    </>
  );
};

export default Profile;
