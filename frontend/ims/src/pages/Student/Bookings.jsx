import React from "react";
import Sidebar from "/src/components/Student/Sidebar.jsx";
import { FaProjectDiagram, FaBookOpen, FaBell } from "react-icons/fa";
import "/src/pages/Student/styles/Bookings.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <h2>📊 Student Overview</h2>

        <div className="dashboard-cards">
          <div className="card">
            <FaProjectDiagram className="card-icon project-icon" />
            <h3>Active Projects</h3>
            <p>View and manage your ongoing projects.</p>
            <button className="view-button">View Projects</button>
          </div>

          <div className="card">
            <FaBookOpen className="card-icon bookings-icon" />
            <h3>Upcoming Bookings</h3>
            <p>Check your upcoming study sessions and reservations.</p>
            <button className="view-button">View Bookings</button>
          </div>

          <div className="card">
            <FaBell className="card-icon notification-icon" />
            <h3>Notifications</h3>
            <p>Stay updated with important alerts and messages.</p>
            <button className="view-button">View Notifications</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
``