import React, { useState } from "react";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import "/src/pages/Admin/styles/Bookings.css";
const Bookings = () => {
  const [activeTab, setActiveTab] = useState("equipment"); // Default tab

  const bookings = {
    equipment: [
      { id: 1, item: "Projector", user: "John Doe", status: "Pending" },
      { id: 2, item: "Laptop", user: "Alice Smith", status: "Approved" },
    ],
    lab: [
      { id: 3, item: "Lab Room 101", user: "David Johnson", status: "Rejected" },
      { id: 4, item: "Lab Room 202", user: "Emily White", status: "Pending" },
    ],
  };

  const handleAction = (id, type, action) => {
    console.log(`Booking ID: ${id}, Type: ${type}, Action: ${action}`);
  };

  return (
    <div className="bookings-container1">
    <div className="bookings-container">
      <Sidebar />
      <div className="bookings-main">
        {/* Top Navbar */}
        <div className="top-navbar">
          <h2>📅 Booking Management</h2>
        </div>

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
              {bookings[activeTab].map((booking, index) => (
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
