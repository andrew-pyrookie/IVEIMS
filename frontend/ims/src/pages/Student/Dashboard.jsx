// Dashboard.jsx
import React from 'react';
import Sidebar from "/src/components/Student/Sidebar.jsx";
import '/src/pages/Student/styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="top-navbar">
          <span className="navbar-title">📊 Student Overview</span>
        </div>
        
        <div className="grid-container">
          <div className="card active-projects">
            <h3>Active Projects</h3>
            <p>3 Ongoing Projects</p>
          </div>
          <div className="card upcoming-bookings">
            <h3>Upcoming Bookings</h3>
            <p>2 Scheduled Sessions</p>
          </div>
          <div className="card notifications">
            <h3>Notifications</h3>
            <p>No new notifications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
