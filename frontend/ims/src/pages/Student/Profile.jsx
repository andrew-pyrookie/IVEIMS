
import React, { useState } from "react";
import Sidebar from "/src/components/Student/Sidebar.jsx";
import '/src/pages/Student/styles/Profile.css';
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+254 712 345 678",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError(""); // Clear errors when toggling
  };

  const handleSave = () => {
    if (profile.password && profile.password !== profile.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Save logic (e.g., send to backend)
    setIsEditing(false);
    setError("");
  };

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="main-content">
        {/* Top Navbar */}
        <div className="top-navbar">
          <span className="navbar-title">⚙️ Profile Settings</span>
        </div>

        {/* Profile Section */}
        <div className="profile-card">
          <FaUserCircle className="user-icon" />
          {!isEditing ? (
            <>
              <h2>{profile.name}</h2>
              <p>Email: {profile.email}</p>
              <p>Phone: {profile.phone}</p>
              <button className="edit-btn" onClick={toggleEdit}>Edit</button>
            </>
          ) : (
            <>
              <input type="text" name="name" value={profile.name} onChange={handleProfileChange} placeholder="Full Name" />
              <input type="email" name="email" value={profile.email} onChange={handleProfileChange} placeholder="Email" />
              <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="Phone" />

              {/* Password Section */}
              <input type="password" name="password" value={profile.password} onChange={handleProfileChange} placeholder="New Password" />
              <input type="password" name="confirmPassword" value={profile.confirmPassword} onChange={handleProfileChange} placeholder="Confirm New Password" />

              {error && <p className="error-msg">{error}</p>}

              <button className="save-btn" onClick={handleSave}>Save</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
