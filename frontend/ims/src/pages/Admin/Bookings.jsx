import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "/src/components/Admin/Sidebar.jsx"; // Import Sidebar
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/Bookings.css"; // Import the CSS file

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterLab, setFilterLab] = useState('');
  const [filterEquipment, setFilterEquipment] = useState('');
  const [viewMode, setViewMode] = useState('equipment'); // 'equipment' or 'lab'

  // Fetch bookings from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/bookings/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bookings.');
        setLoading(false);
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on lab and equipment
  const filteredBookings = bookings.filter((booking) => {
    if (viewMode === 'equipment') {
      return (
        (filterEquipment === '' || booking.equipment.name === filterEquipment) &&
        (filterLab === '' || booking.equipment.current_lab === filterLab)
      );
    } else if (viewMode === 'lab') {
      return filterLab === '' || booking.equipment.current_lab === filterLab;
    }
    return true;
  });

  // Get unique labs and equipment for filters
  const uniqueLabs = [...new Set(bookings.map((booking) => booking.equipment.current_lab))];
  const uniqueEquipment = [...new Set(bookings.map((booking) => booking.equipment.name))];

  if (loading) {
    return <div className="loading-container">Loading bookings...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="bookings-container">
      <Sidebar />
      <Topbar />  
      <h2 className="page-title">Bookings</h2>

      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button
          className={`toggle-button ${viewMode === 'equipment' ? 'active' : ''}`}
          onClick={() => setViewMode('equipment')}
        >
          Equipment Bookings
        </button>
        <button
          className={`toggle-button ${viewMode === 'lab' ? 'active' : ''}`}
          onClick={() => setViewMode('lab')}
        >
          Lab Bookings
        </button>
      </div>

      {/* Filters */}
      <div className="filter-container">
        {viewMode === 'equipment' && (
          <div className="filter-item">
            <label htmlFor="equipment-filter" className="filter-label">
              Filter by Equipment
            </label>
            <select
              id="equipment-filter"
              value={filterEquipment}
              onChange={(e) => setFilterEquipment(e.target.value)}
              className="filter-select"
            >
              <option value="">All Equipment</option>
              {uniqueEquipment.map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="filter-item">
          <label htmlFor="lab-filter" className="filter-label">
            Filter by Lab
          </label>
          <select
            id="lab-filter"
            value={filterLab}
            onChange={(e) => setFilterLab(e.target.value)}
            className="filter-select"
          >
            <option value="">All Labs</option>
            {uniqueLabs.map((lab) => (
              <option key={lab} value={lab}>
                {lab}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>User</th>
              {viewMode === 'equipment' && <th>Equipment</th>}
              {viewMode === 'lab' && <th>Lab</th>}
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.user.name}</td>
                {viewMode === 'equipment' && <td>{booking.equipment.name}</td>}
                {viewMode === 'lab' && <td>{booking.equipment.current_lab}</td>}
                <td>{new Date(booking.start_time).toLocaleString()}</td>
                <td>{new Date(booking.end_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;