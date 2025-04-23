import React from "react";

const Profile = ({ onLogout }) => {
  return (
    <div className="absolute top-12 right-0 bg-white text-black shadow-lg rounded-md w-48 z-50 p-4">
      <p className="font-semibold mb-2">Profile</p>
      <hr className="mb-2" />
      <button
        onClick={onLogout}
        className="w-full text-left text-red-500 hover:text-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
