import React from "react";
import { jwtDecode } from "jwt-decode";
import { LogOut } from "lucide-react"; // Adding a logout icon (optional, looks clean)

const Profile = ({ onLogout }) => {
  let email = "";
  let username = "";
  let role = "";

  // Decode the token if it exists
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      email = decoded.email || "";
      username = decoded.username || "";
      role = decoded.role || "";
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

  // Get first letter of username for the profile circle
  const profileLetter = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <div className="absolute top-12 right-0 bg-white text-black shadow-2xl rounded-xl w-72 z-50 p-6 animate-fadeIn">
      {/* Profile circle */}
      <div className="flex justify-center mb-4">
        <div className="bg-orange-400 text-white w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold">
          {profileLetter}
        </div>
      </div>

      {/* Profile info */}
      <div className="text-center mb-4 space-y-1">
        <p className="text-xl font-extrabold text-gray-800">{username || "Username"}</p>
        <p className="text-sm text-gray-500 break-words">{email || "Email"}</p>
        {role && (
          <span className="inline-block mt-2 bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
            {role.replace("_", " ")}
          </span>
        )}
      </div>

      <hr className="my-4" />

      {/* Logout button */}
      <button
        onClick={onLogout}
        className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold py-2 px-4 rounded-full transition-all duration-200"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default Profile;
