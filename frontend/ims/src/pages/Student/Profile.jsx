import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa"; // Import the user icon
import Sidebar from "/src/components/Student/StudentSidebar.jsx";
import Topbar from "/src/components/Student/StudentTopbar.jsx";
import axios from "axios";
import "/src/pages/Student/styles/Profile.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success pop-up

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/auth/profile/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setProfile({
          name: response.data.name,
          email: response.data.email,
          currentPassword: "",
          password: "",
          confirmPassword: "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to fetch profile data.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    if (profile.password !== profile.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const updatedData = {
        name: profile.name,
        email: profile.email,
        current_password: profile.currentPassword,
        new_password: profile.password,
      };

      await axios.put("http://localhost:8000/api/auth/profile/", updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setIsEditing(false);
      setError("");
      setSuccess("Profile updated successfully!");
      setProfile({ ...profile, currentPassword: "", password: "", confirmPassword: "" });

      // Show success pop-up
      setShowSuccessPopup(true);

      // Hide success pop-up after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data);
      setError(error.response?.data?.message || "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Sidebar />
        <Topbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Sidebar />
      <Topbar />

      {/* Success Pop-up */}
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="success-popup-content">
            <p>Profile updated successfully!</p>
          </div>
        </div>
      )}

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="user-icon">
              <FaUser size={40} /> {/* User icon */}
            </div>
          </div>

          <div className="profile-info">
            {!isEditing ? (
              <>
                <div className="profile-details">
                  <p>
                    <strong>Name:</strong> {profile.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {profile.email}
                  </p>
                </div>
                <button className="edit-btn" onClick={toggleEdit}>
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Full Name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="Email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={profile.currentPassword}
                    onChange={handleProfileChange}
                    placeholder="Current Password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={profile.password}
                    onChange={handleProfileChange}
                    placeholder="New Password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={profile.confirmPassword}
                    onChange={handleProfileChange}
                    placeholder="Confirm New Password"
                  />
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-actions">
                  <button className="cancel-btn" onClick={toggleEdit}>
                    Cancel
                  </button>
                  <button className="save-btn" onClick={handleSave}>
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;