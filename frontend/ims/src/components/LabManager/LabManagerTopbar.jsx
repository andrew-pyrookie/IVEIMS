import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegThumbsUp, FaRegBell, FaChevronDown, FaUser, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "/src/components/LabManager/LabManagerSidebar.jsx";
import "./TopBar.css";

const TopBar = () => {
  const [user, setUser] = useState({ name: "", profileImg: "" });
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [maintenanceNotification, setMaintenanceNotification] = useState(false);
  const [showMaintenanceList, setShowMaintenanceList] = useState(false);
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

  const fetchEquipments = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/equipment/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setEquipments(response.data);

      const today = new Date().toISOString().split('T')[0];
      const needsMaintenance = response.data.some(equipment => equipment.next_maintenance === today);

      if (needsMaintenance) {
        setMaintenanceNotification(true);
      } else {
        setMaintenanceNotification(false);
      }
    } catch (error) {
      console.error("Error fetching equipment data:", error);
    }
  };

  useEffect(() => {
    // Fetch equipment data immediately on component mount
    fetchEquipments();

    // Set up auto-refresh every 5 seconds
    const intervalId = setInterval(fetchEquipments, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
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

  const handleBellClick = () => {
    setShowMaintenanceList(!showMaintenanceList);
  };

  const today = new Date().toISOString().split('T')[0];
  const equipmentsNeedingMaintenance = equipments.filter(equipment => equipment.next_maintenance === today);

  return (
    <div className="topbar">
      <Sidebar /> {/* Include Sidebar component */}
      <div className="topbar-right-content">
        <div className="topbar-notification-container" onClick={handleBellClick}>
          <FaRegBell className="topbar-icon" />
          {maintenanceNotification && <span className="topbar-notification-dot"></span>}
        </div>

        {showMaintenanceList && (
          <div className="maintenance-list">
            <h4>Equipment Needing Maintenance</h4>
            {equipmentsNeedingMaintenance.length > 0 ? (
              <ul>
                {equipmentsNeedingMaintenance.map(equipment => (
                  <li key={equipment.id}>{equipment.name}</li>
                ))}
              </ul>
            ) : (
              <p>No equipment needs maintenance today.</p>
            )}
          </div>
        )}

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