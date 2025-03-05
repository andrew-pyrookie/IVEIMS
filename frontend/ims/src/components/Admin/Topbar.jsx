import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegThumbsUp, FaRegBell, FaChevronDown, FaUser, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "/src/components/Admin/Sidebar.jsx"; // Import Sidebar
import "./TopBar.css";

const TopBar = () => {
  const [user, setUser] = useState({ name: "", profileImg: "" });
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/auth/profile/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUser({
          name: response.data.name,
          profileImg: response.data.profileImg || "https://i.pravatar.cc/40",
        });
      } catch (error) {
        setError("Failed to load user data. Please try again later.");
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.topbar-user-section')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="topbar">
      <Sidebar /> {/* Include Sidebar component */}
      <div className="topbar-right-content">
        <div className="topbar-notification-container">
          <FaRegBell className="topbar-icon" />
          <span className="topbar-notification-dot"></span>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="topbar-user-section" onClick={toggleDropdown}>
            <div className="topbar-user-info">
              <img src={user.profileImg} alt="User" className="topbar-profile-pic" />
              <span className="topbar-username">{user.name}</span>
              <FaChevronDown className="dropdown-icon" />
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item Myprofile">
                  <Link to="/admin/profile">
                    <FaUser className="dropdown-icon-left" />
                    My Profile
                  </Link>
                </div>
                <div className="dropdown-item Editprofile">
                  <Link to="/admin/profile">
                    <FaEdit className="dropdown-icon-left" />
                    Edit Profile
                  </Link>
                </div>

                <hr className="dropdown-divider" />

                <div className="dropdown-item logout" onClick={handleLogout}>
                  <FaSignOutAlt className="dropdown-icon-left" />
                  Sign Out
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
