import React, { useState, useEffect } from "react";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
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
      setProfile({ ...profile, password: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-card">
        <div className="profile-info">
          <h2 className="user-name">  Name: {profile.name}</h2>
          <p className="user-email">Email: {profile.email}</p>

          {!isEditing ? (
            <button className="edit-btn" onClick={toggleEdit}>
              Edit Profile
            </button>
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