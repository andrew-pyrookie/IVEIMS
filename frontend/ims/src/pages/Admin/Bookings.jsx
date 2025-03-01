import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/Bookings.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/bookings", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      const updatedBooking = await response.json();
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? updatedBooking : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="medtech-lab-container">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="medtech-lab-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />

        <div className="content-header">
          <h1>Booking Requests</h1>
          <p>Manage equipment booking requests from students</p>
        </div>

        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bookings..."
            className="search-input"
          />
        </div>

        <div className="bookings-list">
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Equipment</th>
                  <th>Booking Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings
                  .filter((booking) =>
                    booking.student.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.student.name}</td>
                      <td>{booking.equipment.productName}</td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        {booking.status === "Pending" && (
                          <div className="action-buttons">
                            <button
                              className="action-button accept-button"
                              onClick={() => handleStatusUpdate(booking.id, "Accepted")}
                            >
                              <FaCheckCircle /> Accept
                            </button>
                            <button
                              className="action-button reject-button"
                              onClick={() => handleStatusUpdate(booking.id, "Rejected")}
                            >
                              <FaTimesCircle /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;