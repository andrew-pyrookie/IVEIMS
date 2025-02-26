import React, { useState, useEffect } from "react";
import Sidebar from "/src/components/Student/StudentSidebar.jsx";
import Topbar from "/src/components/Student/StudentTopbar.jsx";
import axios from "axios";
import "/src/pages/Admin/styles/AdminProfile.css";


const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setProfile({
          name: response.data.name,
          email: response.data.email,
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
        password: profile.password,
      };

      await axios.put("http://localhost:8000/api/profile/", updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setIsEditing(false);
      setError("");
      setSuccess("Profile updated successfully!");
      setProfile({ ...profile, password: "", confirmPassword: "" });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Sidebar />
      <Topbar />  
      <div className="profile-card">
        <div className="profile-info">
          <h2 className="user-name">Name: {profile.name}</h2>
          <p className="user-email">Email: {profile.email}</p>

          {!isEditing ? (
            <button className="edit-btn" onClick={toggleEdit}>
              Edit Profile
            </button>
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

              {error && <p className="error-msg">{error}</p>}
              {success && <p className="success-msg">{success}</p>}

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
  );
};

export default Profile;