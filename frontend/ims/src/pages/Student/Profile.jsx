import React, { useState, useEffect } from "react";
import Sidebar from "/src/components/Student/Sidebar.jsx";
import '/src/pages/Student/styles/Profile.css';
import { FaUserCircle } from "react-icons/fa";
import axios from "axios"; // Ensure axios is installed

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // For loading state

  const userId = localStorage.getItem("userId"); // Assuming the userId is stored in localStorage after login

  useEffect(() => {
    if (userId) {
      // Fetch the user details using their user ID
      axios
        .get(`http://localhost:8000/api/${userId}/`) // Adjust the API URL based on your backend setup
        .then((response) => {
          // On success, update the profile state
          setProfile({
            name: response.data.name,
            password: "", // Reset the password field
            confirmPassword: "", // Reset confirm password field
          });
          setLoading(false); // Stop the loading state once data is fetched
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user details.");
          setLoading(false); // Stop loading if there's an error
        });
    }
  }, [userId]); // This effect depends on the userId

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

    // Prepare the data to be sent to the backend
    const updatedData = {
      name: profile.name,
      password: profile.password, // Only send the password if it's being updated
    };

    // Send the updated data to the backend
    axios
      .put(`http://localhost:8000/api/${userId}/`, updatedData) // Adjust the API URL and method based on your backend
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        setIsEditing(false);
        setError("");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setError("Failed to update profile.");
      });
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

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
              <button className="edit-btn" onClick={toggleEdit}>Edit</button>
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

              {/* Password Section */}
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

              <button className="save-btn" onClick={handleSave}>Save</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;