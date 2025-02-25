import React, { useState, useEffect } from "react";
import Sidebar from "/src/components/Student/Sidebar.jsx";

import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import '/src/pages/Student/styles/Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you use token-based authentication
          },
        });
        setProfile({ ...profile, name: response.data.name });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to fetch profile data.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError("");
  };

  // Handle save changes
  const handleSave = async () => {
    if (profile.password !== profile.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const updatedData = {
        name: profile.name,
        password: profile.password, // Only send password if it's being updated
      };

      const response = await axios.put(
        "http://localhost:8000/api/profile/",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Profile updated successfully:", response.data);
      setIsEditing(false);
      setError("");
      setProfile({ ...profile, password: "", confirmPassword: "" }); // Clear password fields after saving
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="main-content">
        {/* Top Navbar */}
        <div className="top-navbar">
          <span className="navbar-title">⚙️ Profile Settings</span>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <FaUserCircle className="user-icon" />
          {!isEditing ? (
            <>
              <h2>{profile.name}</h2>
              <button className="edit-btn" onClick={toggleEdit}>
                Edit
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Full Name"
              />
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleProfileChange}
                placeholder="New Password"
              />
              <input
                type="password"
                name="confirmPassword"
                value={profile.confirmPassword}
                onChange={handleProfileChange}
                placeholder="Confirm New Password"
              />

              {error && <p className="error-msg">{error}</p>}

              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;