import React, { useState, useEffect } from 'react';
import StudentSidebar from "/src/components/Student/StudentSidebar.jsx";
import '/src/pages/Student/styles/Dashboard.css';
import Topbar from "/src/components/Student/StudentTopbar.jsx";
import axios from 'axios';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuration for API requests with auth token
  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // Fetch projects from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/projects/', getAuthConfig());
        // Ensure projects is always an array
        setProjects(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
        setProjects([]); // Ensure projects is reset to an empty array on error
      }
    };

    // Fetch equipment bookings from the backend
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/bookings/', getAuthConfig());
        // Ensure bookings is always an array
        setBookings(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again later.");
        setBookings([]); // Ensure bookings is reset to an empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
    fetchBookings();
  }, []);

  // Calculate project counts
  const totalProjects = projects.length;
  const ongoingProjects = projects.filter(project => project.status === 'active').length;
  const pendingProjects = projects.filter(project => project.status === 'pending').length;
  const completedProjects = projects.filter(project => project.status === 'completed').length;

  // Calculate the number of equipment booked
  const equipmentBooked = bookings.length;

  return (
    <div className="dashboard-container">
      <StudentSidebar />
      <Topbar />

      <div className="Dash-main-content">
        <div className="grid-container">
          {/* Total Projects Card */}
          <div className="card active-projects">
            <h3>Total Projects</h3>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <>
                <p>{ongoingProjects} Ongoing Projects</p>
                <p>{pendingProjects} Pending Projects</p>
                <p>{completedProjects} Completed Projects</p>
              </>
            )}
          </div>

          {/* Upcoming Bookings Card */}
          <div className="card upcoming-bookings">
            <h3>Upcoming Bookings</h3>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <p>{equipmentBooked} Equipment Booked</p>
            )}
          </div>

          {/* Notifications Card */}
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