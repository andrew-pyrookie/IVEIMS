import React, { useEffect, useState } from "react";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/Bookings.css";
import { FaCheck, FaTimes, FaSearch } from "react-icons/fa";

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch bookings data
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/bookings/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings data");
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status update (accept or reject)
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      // Ensure the newStatus is valid
      if (!["pending", "approved", "rejected"].includes(newStatus)) {
        console.error("Invalid status:", newStatus);
        return;
      }
  
      // Find the booking to include additional fields if required
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) {
        console.error("Booking not found:", bookingId);
        return;
      }
  
      // Extract the equipment field (assuming it's a string)
      const equipment = booking.equipment; // This is a string, e.g., "gari (Cezeri Lab)"
  
      if (!equipment) {
        console.error("Equipment not found in booking:", booking);
        return;
      }
  
      // Prepare the payload
      const payload = {
        status: newStatus,
        user: booking.user.id, // Include the user ID
        equipment: equipment, // Include the equipment string
      };
  
      // Log the payload for debugging
      console.log("Sending payload:", payload);
  
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        console.error("Failed to update booking status:", errorData);
        throw new Error("Failed to update booking status");
      }
  
      // Refresh the bookings list after updating the status
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  // Filter bookings based on search term
  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.user.name.toLowerCase().includes(searchLower) ||
      booking.user.email.toLowerCase().includes(searchLower) ||
      booking.lab_space.toLowerCase().includes(searchLower) ||
      booking.project.toString().includes(searchTerm)
    );
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <Topbar/>
        <div className="loading-spinner"></div>
        <p>Loading bookings data...</p>
      </div>
    );
  }

  return (
    <div className="admin-booking-management">
      <Topbar/>
      <h1>Booking Management</h1>

      {/* Search Bar */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, lab space, or project ID..."
          className="search-input"
        />
      </div>

      {/* Bookings Table */}
      <table className="booking-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>User Email</th>
            <th>Lab Space</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Project ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length === 0 ? (
            <tr>
              <td colSpan="8" className="no-data">
                No bookings found.
              </td>
            </tr>
          ) : (
            filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.user.name}</td>
                <td>{booking.user.email}</td>
                <td>{booking.lab_space}</td>
                <td>{new Date(booking.start_time).toLocaleString()}</td>
                <td>{new Date(booking.end_time).toLocaleString()}</td>
                <td>{booking.project}</td>
                <td>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  {booking.status === "pending" && (
                    <div className="action-buttons">
                    <button
                      className="approve-button"
                      onClick={() => handleStatusUpdate(booking.id, "approved")}
                      title="Approve Booking"
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleStatusUpdate(booking.id, "rejected")}
                      title="Reject Booking"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookingManagement;