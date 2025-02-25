import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import "/src/pages/Admin/styles/Bookings.css";

const Bookings = () => {
  const [activeTab, setActiveTab] = useState("equipment"); // Default tab
  const [bookings, setBookings] = useState({
    equipment: [],
    lab: [],
  }); // State to hold bookings data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch bookings data from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/equipment/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT token is stored in local storage
          },
        });
        // Assuming the API provides the 'equipment' and 'lab' data
        setBookings({
          equipment: response.data.equipment || [],
          lab: response.data.lab || [],
        }); // Set the bookings data, defaulting to empty arrays if data is missing
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings. Please try again.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleAction = (id, type, action) => {
    console.log(`Booking ID: ${id}, Type: ${type}, Action: ${action}`);
    // Implement the action for approve or reject (e.g., call API to update the booking status)
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="bookings-container1">
      <div className="bookings-container">
        <Sidebar />
        <div className="bookings-main">
  
          {/* Booking Tabs */}
          <div className="booking-tabs">
            <button
              className={activeTab === "equipment" ? "active" : ""}
              onClick={() => setActiveTab("equipment")}
            >
              Equipment Reservations
            </button>
            <button
              className={activeTab === "lab" ? "active" : ""}
              onClick={() => setActiveTab("lab")}
            >
              Lab Space Bookings
            </button>
          </div>

          {/* Booking List */}
          <div className="booking-content">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Safely access bookings[activeTab] using optional chaining */}
                {(bookings[activeTab] || []).map((booking, index) => (
                  <tr key={booking.id}>
                    <td>{index + 1}</td>
                    <td>{booking.item}</td>
                    <td>{booking.user}</td>
                    <td>
                      <span className={`status ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="actions">
                      {booking.status === "Pending" && (
                        <>
                          <button
                            className="approve"
                            onClick={() =>
                              handleAction(booking.id, activeTab, "approve")
                            }
                          >
                            ✅ Approve
                          </button>
                          <button
                            className="reject"
                            onClick={() =>
                              handleAction(booking.id, activeTab, "reject")
                            }
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                      {booking.status !== "Pending" && (
                        <span className="view-only">🔍 View</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
