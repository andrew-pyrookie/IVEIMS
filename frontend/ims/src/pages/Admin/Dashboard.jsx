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

  // Fetch data for each stat from its API
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch("/api/total-users"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch total users");
        }
        const data = await response.json();
        setTotalUsers(data.totalUsers); // Assuming the response contains `totalUsers`
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    const fetchEquipmentAvailable = async () => {
      try {
        const response = await fetch("/api/equipment-available"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch equipment available");
        }
        const data = await response.json();
        setEquipmentAvailable(data.equipmentAvailable); // Assuming the response contains `equipmentAvailable`
      } catch (error) {
        console.error("Error fetching equipment available:", error);
      }
    };

    const fetchPendingEquipmentBookings = async () => {
      try {
        const response = await fetch("/api/pending-equipment-bookings"); // Replace with your actual API endpoint
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
        const response = await fetch("/api/pending-lab-bookings"); // Replace with your actual API endpoint
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
        const response = await fetch("/api/notification"); // Replace with your actual API endpoint
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
        <h1>📊 Dashboard Overview</h1>
        <div className="stats">
          <div className="stat-box">👥 Total Users: {totalUsers}</div>
          <div className="stat-box">📦 Equipment Available: {equipmentAvailable}</div>
          <div className="stat-box">📅 Pending Equipment Bookings: {pendingEquipmentBookings}</div>
          <div className="stat-box">📅 Pending Lab Bookings: {pendingLabBookings}</div>
          <div className="stat-box">📑 Notification: {notification}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
