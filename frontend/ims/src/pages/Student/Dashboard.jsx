// Dashboard.jsx
import React from 'react';
import StudentSidebar from "/src/components/Student/StudentSidebar.jsx";
import '/src/pages/Student/styles/Dashboard.css';
import Topbar from "/src/components/Student/StudentTopbar.jsx"; 

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <StudentSidebar />
      <Topbar />

      <div className="Dash-main-content">
        
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
