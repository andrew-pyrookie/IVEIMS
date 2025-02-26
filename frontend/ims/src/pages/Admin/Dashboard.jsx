import React, { useEffect, useState } from "react";
import Sidebar from "/src/components/Admin/Sidebar.jsx"; // Import Sidebar
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/Dashboard.css"; // Import styles

const Dashboard = () => {
  // Set up state to hold the individual data
  const [totalUsers, setTotalUsers] = useState(0);
  const [equipmentAvailable, setEquipmentAvailable] = useState(0);
  const [pendingEquipmentBookings, setPendingEquipmentBookings] = useState(0);
  const [pendingLabBookings, setPendingLabBookings] = useState(0);
  const [notification, setNotification] = useState("");

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch data for each stat from its API
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/api/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch total users");
        }
        const data = await response.json();
        setTotalUsers(data.length); // Assuming the response is an array of users
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    const fetchEquipmentAvailable = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/api/equipment/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch equipment available");
        }
        const data = await response.json();
        setEquipmentAvailable(data.length); // Assuming the response contains `equipmentAvailable`
      } catch (error) {
        console.error("Error fetching equipment available:", error);
      }
    };

    const fetchPendingEquipmentBookings = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/api/pending-equipment-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch pending equipment bookings");
        }
        const data = await response.json();
        setPendingEquipmentBookings(data.pendingEquipmentBookings); // Assuming the response contains `pendingEquipmentBookings`
      } catch (error) {
        console.error("Error fetching pending equipment bookings:", error);
      }
    };

    const fetchPendingLabBookings = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/api/pending-lab-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch pending lab bookings");
        }
        const data = await response.json();
        setPendingLabBookings(data.pendingLabBookings); // Assuming the response contains `pendingLabBookings`
      } catch (error) {
        console.error("Error fetching pending lab bookings:", error);
      }
    };

    const fetchNotification = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/api/notification", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch notification");
        }
        const data = await response.json();
        setNotification(data.notification); // Assuming the response contains `notification`
      } catch (error) {
        console.error("Error fetching notification:", error);
      }
    };

    // Fetch all data
    fetchTotalUsers();
    fetchEquipmentAvailable();
    fetchPendingEquipmentBookings();
    fetchPendingLabBookings();
    fetchNotification();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Topbar />
      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h1 className="dashboard-title">📊 Dashboard Overview</h1>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-icon">👥</div>
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{totalUsers}</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">📦</div>
            <div className="stat-label">Equipment Available</div>
            <div className="stat-value">{equipmentAvailable}</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">📅</div>
            <div className="stat-label">Pending Equipment Bookings</div>
            <div className="stat-value">{pendingEquipmentBookings}</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">📅</div>
            <div className="stat-label">Pending Lab Bookings</div>
            <div className="stat-value">{pendingLabBookings}</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">📑</div>
            <div className="stat-label">Notification</div>
            <div className="stat-value">{notification}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;