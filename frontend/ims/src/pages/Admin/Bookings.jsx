// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { format } from 'date-fns';
// import AdminSidebar from "/src/components/Admin/Sidebar.jsx";
// import AdminTopbar from "/src/components/Admin/Topbar.jsx";
// import "/src/pages/Admin/styles/Bookings.css"; // Import the CSS file

// const AdminBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

//   // Fetch all bookings when component mounts
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:8000/api/bookings/', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         // Log the API response to debug the structure
//         console.log('API Response:', response.data);

//         // Ensure the response data is an array
//         if (Array.isArray(response.data)) {
//           setBookings(response.data);
//         } else {
//           setError('Invalid data format received from the API.');
//         }
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch booking data. Please try again later.');
//         setLoading(false);
//         console.error('Error fetching bookings:', err);
//       }
//     };

//     fetchBookings();
//   }, []);

//   // Format date and time for display
//   const formatDateTime = (dateTimeString) => {
//     if (!dateTimeString) return 'N/A';
//     return format(new Date(dateTimeString), 'MMM dd, yyyy - h:mm a');
//   };

//   // Handle table sorting
//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   // Get sorted bookings
//   const getSortedBookings = () => {
//     const sortableBookings = [...bookings];
//     if (sortConfig.key) {
//       sortableBookings.sort((a, b) => {
//         // Handle nested properties like "equipment.name"
//         const keyParts = sortConfig.key.split('.');
//         let aValue = a;
//         let bValue = b;
        
//         for (const part of keyParts) {
//           aValue = aValue?.[part];
//           bValue = bValue?.[part];
//         }
        
//         if (aValue < bValue) {
//           return sortConfig.direction === 'ascending' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'ascending' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortableBookings;
//   };

//   // Filter bookings based on search term
//   const getFilteredBookings = () => {
//     if (!searchTerm) return getSortedBookings();
    
//     return getSortedBookings().filter(booking => {
//       const equipmentName = booking.equipment?.name || '';
//       const labName = booking.equipment?.current_lab || '';
//       const userName = booking.user?.name || '';
//       const userEmail = booking.user?.email || '';

//       return (
//         equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         userEmail.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     });
//   };

//   if (loading) {
//     return <div className="admin-loading-container"><div className="admin-loading-spinner"></div></div>;
//   }

//   if (error) {
//     return <div className="admin-error-message">{error}</div>;
//   }

//   return (
//     <div className="admin-bookings-container">
//       <AdminSidebar />
//       <AdminTopbar />
      
//       <div className="admin-content">
//         <h1 className="admin-page-title">Equipment Bookings</h1>
        
//         <div className="admin-controls">
//           <div className="admin-search">
//             <input
//               type="text"
//               placeholder="Search by equipment, lab, or user..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="admin-search-input"
//             />
//             <svg className="admin-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//               <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
//             </svg>
//           </div>
          
//           <div className="admin-filters">
//             <select className="admin-filter-dropdown">
//               <option value="all">All Bookings</option>
//               <option value="upcoming">Upcoming</option>
//               <option value="completed">Completed</option>
//               <option value="active">Currently Active</option>
//             </select>
//           </div>
//         </div>
        
//         <div className="admin-table-container">
//           <table className="admin-bookings-table">
//             <thead>
//               <tr>
//                 <th onClick={() => requestSort('equipment.id')}>
//                   ID
//                   {sortConfig.key === 'equipment.id' && (
//                     <span className={`sort-icon ${sortConfig.direction}`}></span>
//                   )}
//                 </th>
//                 <th onClick={() => requestSort('equipment.name')}>
//                   Equipment Name
//                   {sortConfig.key === 'equipment.name' && (
//                     <span className={`sort-icon ${sortConfig.direction}`}></span>
//                   )}
//                 </th>
//                 <th onClick={() => requestSort('equipment.current_lab')}>
//                   Current Lab
//                   {sortConfig.key === 'equipment.current_lab' && (
//                     <span className={`sort-icon ${sortConfig.direction}`}></span>
//                   )}
//                 </th>
//                 <th onClick={() => requestSort('user.name')}>
//                   Booked By
//                   {sortConfig.key === 'user.name' && (
//                     <span className={`sort-icon ${sortConfig.direction}`}></span>
//                   )}
//                 </th>
//                 <th onClick={() => requestSort('user.email')}>
//                   User Email
//                   {sortConfig.key === 'user.email' && (
//                     <span className={`sort-icon ${sortConfig.direction}`}></span>
//                   )}
//                 </th>
//                 <th onClick={() => requestSort('start_time')}>
//                   Start Time
//                   {sortConfig.key === 'start_time' && (
//                     <span className={`sort-icon ${sortConfig.direction}`}></span>
//                   )}
//                 </th>
//                 <th onClick={() => requestSort('end_time')}>
//                   End Time
//                   {sortConfig.key === 'end_time' && (
//                     <span className={`sort-icon ${sortConfig.direction}`}></span>
//                   )}
//                 </th>
//                 <th onClick={() => requestSort('purpose')}>
//                   Purpose
//                   {sortConfig.key === 'purpose' && (
//                     <span className={`sort-icon ${sortConfig.direction}`}></span>
//                   )}
//                 </th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getFilteredBookings().length === 0 ? (
//                 <tr>
//                   <td colSpan="9" className="admin-no-data">No bookings found</td>
//                 </tr>
//               ) : (
//                 getFilteredBookings().map((booking) => {
//                   const isActiveBooking = new Date(booking.start_time) <= new Date() && new Date(booking.end_time) >= new Date();
//                   const isPastBooking = new Date(booking.end_time) < new Date();
                  
//                   return (
//                     <tr key={booking.id} className={`admin-booking-row ${isActiveBooking ? 'active-booking' : ''} ${isPastBooking ? 'past-booking' : ''}`}>
//                       <td>{booking.equipment?.id || 'N/A'}</td>
//                       <td>{booking.equipment?.name || 'N/A'}</td>
//                       <td>{booking.equipment?.current_lab || 'N/A'}</td>
//                       <td>{booking.user?.name || 'N/A'}</td>
//                       <td>{booking.user?.email || 'N/A'}</td>
//                       <td>{formatDateTime(booking.start_time)}</td>
//                       <td>{formatDateTime(booking.end_time)}</td>
//                       <td className="purpose-cell">{booking.purpose || 'Not specified'}</td>
//                       <td>
//                         <div className="admin-actions">
//                           <button className="admin-view-btn" title="View Details">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                               <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
//                             </svg>
//                           </button>
//                           <button className="admin-cancel-btn" title="Cancel Booking">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                               <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
//                             </svg>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminBookings;






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import AdminSidebar from "/src/components/Admin/Sidebar.jsx";
import AdminTopbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/Bookings.css"; // Import the CSS file

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Fetch all bookings when component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/bookings/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Log the API response to debug the structure
        console.log('API Response:', response.data);

        // Ensure the response data is an array
        if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          setError('Invalid data format received from the API.');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch booking data. Please try again later.');
        setLoading(false);
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
  }, []);

  // Format date and time for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return format(new Date(dateTimeString), 'MMM dd, yyyy - h:mm a');
  };

  // Handle table sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted bookings
  const getSortedBookings = () => {
    const sortableBookings = [...bookings];
    if (sortConfig.key) {
      sortableBookings.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBookings;
  };

  // Filter bookings based on search term
  const getFilteredBookings = () => {
    if (!searchTerm) return getSortedBookings();
    
    return getSortedBookings().filter(booking => {
      const equipmentName = booking.equipment_name || '';
      const labName = booking.lab_name || '';
      const userName = booking.user_name || '';
      const userEmail = booking.user_email || '';

      return (
        equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  if (loading) {
    return <div className="admin-loading-container"><div className="admin-loading-spinner"></div></div>;
  }

  if (error) {
    return <div className="admin-error-message">{error}</div>;
  }

  return (
    <div className="admin-bookings-container">
      <AdminSidebar />
      <AdminTopbar />
      
      <div className="admin-content">
        <h1 className="admin-page-title">Equipment Bookings</h1>
        
        <div className="admin-controls">
          <div className="admin-search">
            <input
              type="text"
              placeholder="Search by equipment, lab, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
            <svg className="admin-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
          
          <div className="admin-filters">
            <select className="admin-filter-dropdown">
              <option value="all">All Bookings</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="active">Currently Active</option>
            </select>
          </div>
        </div>
        
        <div className="admin-table-container">
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('id')}>
                  ID
                  {sortConfig.key === 'id' && (
                    <span className={`sort-icon ${sortConfig.direction}`}></span>
                  )}
                </th>
                <th onClick={() => requestSort('equipment_name')}>
                  Equipment Name
                  {sortConfig.key === 'equipment_name' && (
                    <span className={`sort-icon ${sortConfig.direction}`}></span>
                  )}
                </th>
                <th onClick={() => requestSort('lab_name')}>
                  Current Lab
                  {sortConfig.key === 'lab_name' && (
                    <span className={`sort-icon ${sortConfig.direction}`}></span>
                  )}
                </th>
                <th onClick={() => requestSort('user_name')}>
                  Booked By
                  {sortConfig.key === 'user_name' && (
                    <span className={`sort-icon ${sortConfig.direction}`}></span>
                  )}
                </th>
                <th onClick={() => requestSort('user_email')}>
                  User Email
                  {sortConfig.key === 'user_email' && (
                    <span className={`sort-icon ${sortConfig.direction}`}></span>
                  )}
                </th>
                <th onClick={() => requestSort('start_time')}>
                  Start Time
                  {sortConfig.key === 'start_time' && (
                    <span className={`sort-icon ${sortConfig.direction}`}></span>
                  )}
                </th>
                <th onClick={() => requestSort('end_time')}>
                  End Time
                  {sortConfig.key === 'end_time' && (
                    <span className={`sort-icon ${sortConfig.direction}`}></span>
                  )}
                </th>
                <th onClick={() => requestSort('purpose')}>
                  Purpose
                  {sortConfig.key === 'purpose' && (
                    <span className={`sort-icon ${sortConfig.direction}`}></span>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredBookings().length === 0 ? (
                <tr>
                  <td colSpan="9" className="admin-no-data">No bookings found</td>
                </tr>
              ) : (
                getFilteredBookings().map((booking) => {
                  const isActiveBooking = new Date(booking.start_time) <= new Date() && new Date(booking.end_time) >= new Date();
                  const isPastBooking = new Date(booking.end_time) < new Date();
                  
                  return (
                    <tr key={booking.id} className={`admin-booking-row ${isActiveBooking ? 'active-booking' : ''} ${isPastBooking ? 'past-booking' : ''}`}>
                      <td>{booking.id || 'N/A'}</td>
                      <td>{booking.equipment_name || 'N/A'}</td>
                      <td>{booking.lab_name || 'N/A'}</td>
                      <td>{booking.user_name || 'N/A'}</td>
                      <td>{booking.user_email || 'N/A'}</td>
                      <td>{formatDateTime(booking.start_time)}</td>
                      <td>{formatDateTime(booking.end_time)}</td>
                      <td className="purpose-cell">{booking.purpose || 'Not specified'}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-view-btn" title="View Details">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            </svg>
                          </button>
                          <button className="admin-cancel-btn" title="Cancel Booking">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;