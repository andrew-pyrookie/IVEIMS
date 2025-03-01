import React, { useState, useEffect } from "react";
import StudentSidebar from "/src/components/Student/StudentSidebar.jsx";
import '/src/pages/Student/styles/Bookings.css';
import Topbar from "/src/components/Student/StudentTopbar.jsx";


const StudentBookingPage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    equipmentId: "",
    bookingDate: "",
  });

  useEffect(() => {
    fetchEquipment();
    fetchBookings();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/equipment", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setEquipmentList(data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking");
      }

      const newBooking = await response.json();
      setBookings([...bookings, newBooking]);
      setFormData({ equipmentId: "", bookingDate: "" });
    } catch (error) {
      console.error("Error submitting booking:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="medtech-lab-container">
        <StudentSidebar />
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
          <h1>Book Equipment</h1>
          <p>Request to book lab equipment</p>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="equipmentId">Select Equipment</label>
            <select
              id="equipmentId"
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select equipment</option>
              {equipmentList.map((equipment) => (
                <option key={equipment.id} value={equipment.id}>
                  {equipment.productName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bookingDate">Booking Date</label>
            <input
              type="date"
              id="bookingDate"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Submit Booking
          </button>
        </form>

        <div className="bookings-list">
          <h2>My Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Booking Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.equipment.productName}</td>
                    <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
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

export default StudentBookingPage;