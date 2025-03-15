const Sidebar = ({ user, setSidebarOpen }) => {
    return (
      <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-4">
        <button onClick={() => setSidebarOpen(false)} className="absolute top-2 right-2 text-xl">✖</button>
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        
        {user?.profileImage && (
          <img
            src={`http://localhost:5000${user.profileImage}`}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto border-4 border-blue-500"
          />
        )}
  
        <div className="mt-4 space-y-2">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
        </div>
      </div>
    );
  };
  
  export default Sidebar;
  