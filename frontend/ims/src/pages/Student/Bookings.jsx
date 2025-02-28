import React, { useState, useEffect } from 'react';
import Sidebar from "/src/components/Student/StudentSidebar.jsx";
import Topbar from "/src/components/Student/StudentTopbar.jsx";
import "/src/pages/Student/styles/Bookings.css";
import axios from 'axios';
import { FaCalendarAlt } from "react-icons/fa";
import { format } from 'date-fns';

const Booking = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [bookingData, setBookingData] = useState({
    start_time: '',
    end_time: ''
  });
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookedEquipmentModal, setShowBookedEquipmentModal] = useState(false);
  const [bookedEquipment, setBookedEquipment] = useState([]);
  const [bookedEquipmentLoading, setBookedEquipmentLoading] = useState(false);
  const [bookedEquipmentError, setBookedEquipmentError] = useState(null);

  // Fetch equipment data when component mounts
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/equipment/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEquipment(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch equipment data. Please try again later.');
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const handleBookClick = (equipment) => {
    setSelectedEquipment(equipment);
    setShowBookingModal(true);
    setBookingError(null);
    setBookingSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError(null);
    
    if (!bookingData.start_time || !bookingData.end_time) {
      setBookingError('Please select both start and end times');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const user_id = localStorage.getItem('user_id');

      if (!user_id) {
        setBookingError('User ID not found. Please log in again.');
        return;
      }
  
      const payload = {
        equipment: selectedEquipment.id, // Changed from equipment_id to equipment
        start_time: new Date(bookingData.start_time).toISOString(),
        end_time: new Date(bookingData.end_time).toISOString(),
        user_id: parseInt(user_id, 10)
      };
  
      console.log('Sending payload:', payload);
  
      const response = await axios.post('http://localhost:8000/api/bookings/', payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log('Booking response:', response.data);
  
      setBookingSuccess(true);
      // Reset form
      setBookingData({
        start_time: '',
        end_time: ''
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Booking error:', err.response?.data || err.message);
      setBookingError(
        err.response?.data?.error || 
        'Failed to book equipment. Please try again.'
      );
    }
  };
  
  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedEquipment(null);
    setBookingData({
      start_time: '',
      end_time: ''
    });
    setBookingError(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchBookedEquipment = async () => {
    setBookedEquipmentLoading(true);
    setBookedEquipmentError(null);

    try {
      const token = localStorage.getItem('token');
      const user_id = localStorage.getItem('user_id');

      if (!user_id) {
        setBookedEquipmentError('User ID not found. Please log in again.');
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/bookings/?user_id=${user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Ensure the response includes equipment_id or equipment.id
      const bookedEquipmentWithIds = response.data.map(booking => ({
        ...booking,
        equipment_id: booking.equipment.id // Access equipment ID
      }));

      setBookedEquipment(bookedEquipmentWithIds);
      setShowBookedEquipmentModal(true);
    } catch (err) {
      setBookedEquipmentError('Failed to fetch booked equipment. Please try again later.');
    } finally {
      setBookedEquipmentLoading(false);
    }
  };

  const handleUnbook = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8000/api/bookings/${bookingId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 204) { // 204 means "No Content" (successful deletion)
        // Refresh the booked equipment list
        fetchBookedEquipment();
      }
    } catch (err) {
      console.error('Unbooking error:', err.response?.data || err.message);
      alert('Failed to unbook equipment. Please try again.');
    }
  };

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading-spinner-container"><div className="loading-spinner"></div></div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MM/dd/yyyy');
  };

  return (
    <div className="equipment-container">
      <Sidebar />
      <Topbar />
      <h1 className="page-title">Laboratory Equipment Inventory</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by equipment name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <button onClick={fetchBookedEquipment} className="booked-equipment-button">
          BOOKED EQUIPMENT
        </button>
      </div>

      <div className="table-container">
        <table className="equipment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Equipment Name</th>
              <th>Current Lab</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipment.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No equipment found</td>
              </tr>
            ) : (
              filteredEquipment.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.current_lab}</td>
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="description-cell">{item.description || 'No description'}</td>
                  <td>
                    <button
                      onClick={() => handleBookClick(item)}
                      disabled={item.status !== 'available'}
                      className={`book-button ${item.status !== 'available' ? 'disabled' : ''}`}
                    >
                      {item.status === 'available' ? 'Book Now' : 'Unavailable'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedEquipment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Book Equipment</h3>
              <button onClick={closeModal} className="close-button">×</button>
            </div>

            {bookingSuccess ? (
              <div className="success-message">
                <svg className="success-icon" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                </svg>
                Equipment booked successfully!
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="equipment-info">
                  <div className="info-item">
                    <span className="label">Equipment:</span> 
                    <span className="value">{selectedEquipment.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Lab:</span> 
                    <span className="value">{selectedEquipment.current_lab}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Status:</span> 
                    <span className={`value status-text ${selectedEquipment.status}`}>
                      {selectedEquipment.status}
                    </span>
                  </div>
                </div>

                {bookingError && (
                  <div className="error-message">
                    <svg className="error-icon" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                    </svg>
                    {bookingError}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="start_time">Start Time</label>
                  <input
                    id="start_time"
                    type="datetime-local"
                    name="start_time"
                    value={bookingData.start_time}
                    onChange={handleInputChange}
                    required
                  />
                  <FaCalendarAlt
                  style={{
                    position: "absolute",
                    right: "-10px",
                    top: "50%",
                    transform: "translateY(0%)",
                    cursor: "pointer",
                    color: "#555",
                  }}
                  onClick={() => document.getElementById("start_time").showPicker()} // Open date picker
                />
                </div>

                <div className="form-group">
                  <label htmlFor="end_time">End Time</label>
                  <input
                    id="end_time"
                    type="datetime-local"
                    name="end_time"
                    value={bookingData.end_time}
                    onChange={handleInputChange}
                    required
                  />
                  <FaCalendarAlt
                  style={{
                    position: "absolute",
                    right: "-10px",
                    top: "50%",
                    transform: "translateY(0%)",
                    cursor: "pointer",
                    color: "#555",
                  }}
                  onClick={() => document.getElementById("end_time").showPicker()} // Open date picker
                />
                </div>

                <button type="submit" className="submit-button">
                  Confirm Booking
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Booked Equipment Modal */}
      {showBookedEquipmentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Booked Equipment</h3>
              <button onClick={() => setShowBookedEquipmentModal(false)} className="close-button">×</button>
            </div>

            {bookedEquipmentLoading ? (
              <div className="loading-spinner-container"><div className="loading-spinner"></div></div>
            ) : bookedEquipmentError ? (
              <div className="error-message">{bookedEquipmentError}</div>
            ) : (
              <div className="booked-equipment-list">
                {bookedEquipment.length === 0 ? (
                  <div className="no-data">No equipment booked</div>
                ) : (
                  <table className="equipment-table">
                    <thead>
                      <tr>
                        <th>Equipment ID</th> {/* New column for equipment ID */}
                        <th>Equipment Name</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookedEquipment.map((booking) => (
                        <tr key={booking.id}>
                          <td>{booking.equipment_id}</td> {/* Display equipment ID */}
                          <td>{booking.equipment.name}</td>
                          <td>{formatDate(booking.start_time)}</td>
                          <td>{formatDate(booking.end_time)}</td>
                          <td>
                            <span className={`status-badge ${booking.status}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleUnbook(booking.id)}
                              className="unbook-button"
                            >
                              Unbook
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;