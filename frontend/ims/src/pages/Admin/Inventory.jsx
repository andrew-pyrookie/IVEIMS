// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
// import Sidebar from "/src/components/Admin/Sidebar.jsx";
// import Topbar from "/src/components/Admin/Topbar.jsx";
// import "/src/pages/Admin/styles/Inventory.css"; // Import the CSS file

// const Inventory = () => {
//   const [equipment, setEquipment] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedEquipment, setSelectedEquipment] = useState(null);
//   const [filterStatus, setFilterStatus] = useState('');
//   const [filterLab, setFilterLab] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newEquipment, setNewEquipment] = useState({
//     name: '',
//     status: 'available',
//     current_lab: '',
//     unique_code: '',
//     lab: '',
//     description: '',
//     next_maintenance: '',
//     last_maintenance: '' 
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [equipmentToUpdate, setEquipmentToUpdate] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  
//   // Get token from localStorage or session storage
//   const getAuthToken = () => {
//     return localStorage.getItem('token');
//   };

//   useEffect(() => {
//     const fetchEquipment = async () => {
//       try {
//         setLoading(true);
//         const token = getAuthToken();
        
//         // Use your API endpoint for equipment
//         const response = await axios.get('http://localhost:8000/api/equipment/', {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : ''
//           }
//         });
//         setEquipment(Array.isArray(response.data) ? response.data : []);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch equipment data');
//         setLoading(false);
//         console.error('Error fetching equipment:', err);
//       }
//     };

//     fetchEquipment();
//   }, []);

//   const handleEquipmentClick = (item) => {
//     setSelectedEquipment(item);
//   };

//   const closeDetails = () => {
//     setSelectedEquipment(null);
//   };

//   const openAddModal = () => {
//     setShowAddModal(true);
//   };

//   const closeAddModal = () => {
//     setShowAddModal(false);
//     setNewEquipment({
//       name: '',
//       status: 'available',
//       current_lab: '',
//       unique_code: '',
//       lab: '',
//       description: '',
//       next_maintenance: ''
//     });
//     setSubmitError(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewEquipment({
//       ...newEquipment,
//       [name]: value
//     });
//   };

//   const handleAddEquipment = async (e) => {
//     e.preventDefault();
//     setSubmitLoading(true);
//     setSubmitError(null);
    
//     try {
//       const token = getAuthToken();
      
//       const response = await axios.post('http://localhost:8000/api/equipment/', newEquipment, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : '',
//           'Content-Type': 'application/json'
//         }
//       });
      
//       setEquipment([...equipment, response.data]);
//       setSubmitLoading(false);
//       closeAddModal();
//     } catch (err) {
//       setSubmitError('Failed to add equipment. Please try again.');
//       setSubmitLoading(false);
//       console.error('Error adding equipment:', err);
//     }
//   };
  
//   const handleChangeStatus = (equipment) => {
//     setEquipmentToUpdate(equipment);
//     setShowStatusModal(true);
//   };

//   const handleStatusChangeConfirm = async (newStatus) => {
//     if (newStatus && ['available', 'in use', 'maintenance'].includes(newStatus)) {
//       try {
//         const token = getAuthToken();
//         const response = await axios.patch(
//           `http://localhost:8000/api/equipment/${equipmentToUpdate.id}/`,
//           { status: newStatus },
//           {
//             headers: {
//               Authorization: token ? `Bearer ${token}` : '',
//               'Content-Type': 'application/json'
//             }
//           }
//         );
        
//         // Update the equipment list with the new status
//         setEquipment(prevEquipment => 
//           prevEquipment.map(item => 
//             item.id === equipmentToUpdate.id ? { ...item, status: newStatus } : item
//           )
//         );
//         setShowStatusModal(false);
//       } catch (err) {
//         console.error('Error changing status:', err);
//         setSubmitError('Failed to change status. Please try again.');
//       }
//     } else {
//       setSubmitError('Invalid status. Please select one of: available, in use, maintenance.');
//     }
//   };

//   const handleDeleteEquipment = (equipment) => {
//     setEquipmentToDelete(equipment);
//     setShowDeleteModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       const token = getAuthToken();
//       await axios.delete(
//         `http://localhost:8000/api/equipment/${equipmentToDelete.id}/`,
//         {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : ''
//           }
//         }
//       );
      
//       // Remove the deleted equipment from the list
//       setEquipment(prevEquipment => 
//         prevEquipment.filter(item => item.id !== equipmentToDelete.id)
//       );
//       setShowDeleteModal(false);
//     } catch (err) {
//       console.error('Error deleting equipment:', err);
//       setSubmitError('Failed to delete equipment. Please try again.');
//     }
//   };

//   // Function to download QR code
//   const handleDownloadQRCode = (qrCodeUrl, equipmentName) => {
//     // Create a link element
//     const link = document.createElement('a');
//     link.href = qrCodeUrl;
//     link.download = `${equipmentName}_QR_Code.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Get unique labs for filter dropdown
//   const uniqueLabs = useMemo(() => {
//     return Array.isArray(equipment) 
//       ? [...new Set(equipment.map(item => item.current_lab).filter(Boolean))]
//       : [];
//   }, [equipment]);

//   // Get status badge class
//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case 'available':
//         return 'status-badge status-available';
//       case 'in use':
//         return 'status-badge status-in-use';
//       case 'maintenance':
//         return 'status-badge status-maintenance';
//       default:
//         return 'status-badge';
//     }
//   };

//   // React Table Configuration
//   const columns = useMemo(() => [
//     {
//       Header: 'Name',
//       accessor: 'name',
//     },
//     {
//       Header: 'Status',
//       accessor: 'status',
//       Cell: ({ value }) => (
//         <span className={getStatusBadgeClass(value)}>
//           {value}
//         </span>
//       )
//     },
//     {
//       Header: 'Current Lab',
//       accessor: 'current_lab',
//     },
//     {
//       Header: 'Unique Code',
//       accessor: 'unique_code',
//     },
//     {
//       Header: 'Next Maintenance',
//       accessor: 'next_maintenance',
//       Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : '-'
//     },
//     {
//       Header: 'QR Code',
//       accessor: 'qr_code',
//       Cell: ({ value, row }) => value ? (
//         <button 
//           onClick={() => handleDownloadQRCode(value, row.original.name)}
//           className="qr-download-button"
//         >
//           Download QR
//         </button>
//       ) : '-'
//     },
//     {
//       Header: 'Actions',
//       id: 'actions',
//       Cell: ({ row }) => (
//         <div className="actions-container">
//           <button 
//             onClick={() => handleEquipmentClick(row.original)}
//             className="view-details-button"
//           >
//             View Details
//           </button>
//           <button 
//             onClick={() => handleChangeStatus(row.original)}
//             className="change-status-button"
//           >
//             Change Status
//           </button>
//           <button 
//             onClick={() => handleDeleteEquipment(row.original)}
//             className="delete-button"
//           >
//             Delete
//           </button>
//         </div>
//       )
//     }
//   ], []);

//   // Apply filters to the data
//   const data = useMemo(() => {
//     if (!Array.isArray(equipment)) return [];
    
//     return equipment.filter(item => {
//       return (
//         (filterStatus === '' || item.status === filterStatus) &&
//         (filterLab === '' || item.current_lab === filterLab)
//       );
//     });
//   }, [equipment, filterStatus, filterLab]);

//   // Initialize react-table
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     state: { pageIndex, pageSize }
//   } = useTable(
//     { 
//       columns,
//       data,
//       initialState: { pageIndex: 0, pageSize: 10 }
//     },
//     useFilters,
//     useSortBy,
//     usePagination
//   );

//   if (loading) {
//     return <div className="loading-container">Loading equipment data...</div>;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   return (
//     <div className="equipment-container">
//         <Sidebar />
//         <Topbar />
//       <h1 className="page-title">Laboratory Equipment</h1>
//       <div className="actions-container-filter-container">
//       <div className="actions-container">
//         <button 
//           className="add-equipment-button" 
//           onClick={openAddModal}
//         >
//           Add Equipment
//         </button>
//       </div>
      
//       {/* Filters */}
//       <div className="filter-container">
//         <div className="filter-item">
//           <label htmlFor="status-filter" className="filter-label">
//             Filter by Status
//           </label>
//           <select
//             id="status-filter"
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="filter-select"
//           >
//             <option value="">All Statuses</option>
//             <option value="available">Available</option>
//             <option value="in use">In Use</option>
//             <option value="maintenance">Maintenance</option>
//           </select>
//         </div>
        
//         <div className="filter-item">
//           <label htmlFor="lab-filter" className="filter-label">
//             Filter by Lab
//           </label>
//           <select
//             id="lab-filter"
//             value={filterLab}
//             onChange={(e) => setFilterLab(e.target.value)}
//             className="filter-select"
//           >
//             <option value="">All Labs</option>
//             {uniqueLabs.map(lab => (
//               <option key={lab} value={lab}>{lab}</option>
//             ))}
//           </select>
//         </div>
//       </div>
//       </div>

//       {/* React Table */}
//       <div className="table-container">
//         <table {...getTableProps()} className="equipment-table">
//           <thead>
//             {headerGroups.map(headerGroup => (
//               <tr {...headerGroup.getHeaderGroupProps()}>
//                 {headerGroup.headers.map(column => (
//                   <th 
//                     {...column.getHeaderProps(column.getSortByToggleProps())}
//                     className={`table-header ${column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : ''}`}
//                   >
//                     {column.render('Header')}
//                     <span>
//                       {column.isSorted
//                         ? column.isSortedDesc
//                           ? ' 🔽'
//                           : ' 🔼'
//                         : ''}
//                     </span>
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody {...getTableBodyProps()}>
//             {page.map(row => {
//               prepareRow(row);
//               return (
//                 <tr {...row.getRowProps()} className="table-row">
//                   {row.cells.map(cell => (
//                     <td {...cell.getCellProps()} className="table-cell">
//                       {cell.render('Cell')}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Equipment Details Modal */}
//       {selectedEquipment && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h2 className="modal-title">{selectedEquipment.name}</h2>
//               <button 
//                 onClick={closeDetails}
//                 className="close-button"
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div className="modal-details">
//               <div className="detail-grid">
//                 <div className="detail-item">
//                   <p className="detail-label">Status</p>
//                   <p className={getStatusBadgeClass(selectedEquipment.status)}>
//                     {selectedEquipment.status}
//                   </p>
//                 </div>
                
//                 <div className="detail-item">
//                   <p className="detail-label">Current Lab</p>
//                   <p className="detail-value">{selectedEquipment.current_lab}</p>
//                 </div>
                
//                 <div className="detail-item">
//                   <p className="detail-label">Unique Code</p>
//                   <p className="detail-value">{selectedEquipment.unique_code}</p>
//                 </div>
                
//                 <div className="detail-item">
//                   <p className="detail-label">Home Lab</p>
//                   <p className="detail-value">{selectedEquipment.lab}</p>
//                 </div>
                
//                 {selectedEquipment.last_maintenance && (
//                   <div className="detail-item">
//                     <p className="detail-label">Last Maintenance</p>
//                     <p className="detail-value">{new Date(selectedEquipment.last_maintenance).toLocaleDateString()}</p>
//                   </div>
//                 )}
                
//                 {selectedEquipment.next_maintenance && (
//                   <div className="detail-item">
//                     <p className="detail-label">Next Maintenance</p>
//                     <p className="detail-value">{new Date(selectedEquipment.next_maintenance).toLocaleDateString()}</p>
//                   </div>
//                 )}
                
//                 {selectedEquipment.created_at && (
//                   <div className="detail-item">
//                     <p className="detail-label">Created At</p>
//                     <p className="detail-value">{new Date(selectedEquipment.created_at).toLocaleDateString()}</p>
//                   </div>
//                 )}
//               </div>
              
//               {selectedEquipment.description && (
//                 <div className="description-container">
//                   <p className="detail-label">Description</p>
//                   <p className="detail-description">{selectedEquipment.description}</p>
//                 </div>
//               )}
              
//               {selectedEquipment.qr_code && (
//                 <div className="qr-container">
//                   <p className="detail-label">QR Code</p>
//                   <div className="qr-image-container">
//                     <img 
//                       src={selectedEquipment.qr_code} 
//                       alt="Equipment QR Code" 
//                       className="qr-image"
//                     />
//                     <button 
//                       onClick={() => handleDownloadQRCode(selectedEquipment.qr_code, selectedEquipment.name)}
//                       className="qr-download-button"
//                     >
//                       Download QR Code
//                     </button>
//                   </div>
//                 </div>
//               )}
              
//               <div className="modal-actions">
//                 <button 
//                   className="close-modal-button"
//                   onClick={closeDetails}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Equipment Modal */}
//       {showAddModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h2 className="modal-title">Add New Equipment</h2>
//               <button 
//                 onClick={closeAddModal}
//                 className="close-button"
//               >
//                 ✕
//               </button>
//             </div>
            
//             <form onSubmit={handleAddEquipment} className="add-equipment-form">
//               <div className="form-grid">
//                 <div className="form-group">
//                   <label htmlFor="name" className="form-label">Equipment Name*</label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={newEquipment.name}
//                     onChange={handleInputChange}
//                     className="form-input"
//                     required
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label htmlFor="unique_code" className="form-label">Unique Code*</label>
//                   <input
//                     type="text"
//                     id="unique_code"
//                     name="unique_code"
//                     value={newEquipment.unique_code}
//                     onChange={handleInputChange}
//                     className="form-input"
//                     required
//                   />
//                   <small className="helper-text">This will be used to generate the QR code automatically.</small>
//                 </div>
                
//                 <div className="form-group">
//                   <label htmlFor="status" className="form-label">Status</label>
//                   <select
//                     id="status"
//                     name="status"
//                     value={newEquipment.status}
//                     onChange={handleInputChange}
//                     className="form-select"
//                   >
//                     <option value="available">Available</option>
//                     <option value="in use">In Use</option>
//                     <option value="maintenance">Maintenance</option>
//                   </select>
//                 </div>
                
//                 <div className="form-group">
//                   <label htmlFor="current_lab" className="form-label">Current Lab*</label>
//                   <input
//                     type="text"
//                     id="current_lab"
//                     name="current_lab"
//                     value={newEquipment.current_lab}
//                     onChange={handleInputChange}
//                     className="form-input"
//                     required
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label htmlFor="lab" className="form-label">Home Lab</label>
//                   <input
//                     type="text"
//                     id="lab"
//                     name="lab"
//                     value={newEquipment.lab}
//                     onChange={handleInputChange}
//                     className="form-input"
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label htmlFor="next_maintenance" className="form-label">Next Maintenance Date</label>
//                   <input
//                     type="date"
//                     id="next_maintenance"
//                     name="next_maintenance"
//                     value={newEquipment.next_maintenance}
//                     onChange={handleInputChange}
//                     className="form-input"
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="last-maintenance" className="form-label">Last Maintenance</label>
//                     <input
//                       type="date"
//                       id="last-maintenance"
//                       name="last_maintenance"
//                       value={newEquipment.last_maintenance}
//                       onChange={handleInputChange}
//                       required
//                     /> 
//                 </div>

//               </div>
              
//               <div className="form-group full-width">
//                 <label htmlFor="description" className="form-label">Description</label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   value={newEquipment.description}
//                   onChange={handleInputChange}
//                   className="form-textarea"
//                   rows="4"
//                 />
//               </div>
              
//               {submitError && (
//                 <div className="error-message">{submitError}</div>
//               )}
              
//               <div className="form-actions">
//                 <button 
//                   type="button" 
//                   onClick={closeAddModal}
//                   className="cancel-button"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="submit-button"
//                   disabled={submitLoading}
//                 >
//                   {submitLoading ? 'Adding...' : 'Add Equipment'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Change Status Modal */}
//       {showStatusModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h2 className="modal-title">Change Status</h2>
//               <button 
//                 onClick={() => setShowStatusModal(false)}
//                 className="close-button"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="modal-body">
//               <p>Select a new status for <strong>{equipmentToUpdate?.name}</strong>:</p>
//               <div className="status-options">
//                 <button 
//                   className="status-option available"
//                   onClick={() => handleStatusChangeConfirm('available')}
//                 >
//                   Available
//                 </button>
//                 <button 
//                   className="status-option in-use"
//                   onClick={() => handleStatusChangeConfirm('in use')}
//                 >
//                   In Use
//                 </button>
//                 <button 
//                   className="status-option maintenance"
//                   onClick={() => handleStatusChangeConfirm('maintenance')}
//                 >
//                   Maintenance
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h2 className="modal-title">Delete Equipment</h2>
//               <button 
//                 onClick={() => setShowDeleteModal(false)}
//                 className="close-button"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="modal-body">
//               <p>Are you sure you want to delete <strong>{equipmentToDelete?.name}</strong>?</p>
//               <div className="confirmation-buttons">
//                 <button 
//                   className="confirm-button"
//                   onClick={handleDeleteConfirm}
//                 >
//                   Yes, Delete
//                 </button>
//                 <button 
//                   className="cancel-button"
//                   onClick={() => setShowDeleteModal(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Inventory;


import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import { FaCalendarAlt } from "react-icons/fa";
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/Inventory.css"; // Import the CSS file

const Inventory = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLab, setFilterLab] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    status: 'available',
    current_lab: '',
    unique_code: '',
    lab: '',
    description: '',
    next_maintenance: '',
    last_maintenance: '' 
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [equipmentToUpdate, setEquipmentToUpdate] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    to_lab: '',
    transfer_date: new Date().toISOString().split('T')[0]
  });
  const [activeTab, setActiveTab] = useState('status'); // 'status' or 'transfer'
  
  // Get token from localStorage or session storage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      // Use your API endpoint for equipment
      const response = await axios.get('http://localhost:8000/api/equipment/', {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      setEquipment(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch equipment data');
      setLoading(false);
      console.error('Error fetching equipment:', err);
    }
  };

  const handleEquipmentClick = (item) => {
    setSelectedEquipment(item);
  };

  const closeDetails = () => {
    setSelectedEquipment(null);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewEquipment({
      name: '',
      status: 'available',
      current_lab: '',
      unique_code: '',
      lab: '',
      description: '',
      next_maintenance: ''
    });
    setSubmitError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment({
      ...newEquipment,
      [name]: value
    });
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData({
      ...updateData,
      [name]: value
    });
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    
    try {
      const token = getAuthToken();
      
      const response = await axios.post('http://localhost:8000/api/equipment/', newEquipment, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      setEquipment([...equipment, response.data]);
      setSubmitLoading(false);
      closeAddModal();
    } catch (err) {
      setSubmitError('Failed to add equipment. Please try again.');
      setSubmitLoading(false);
      console.error('Error adding equipment:', err);
    }
  };
  
  const handleUpdateEquipment = (equipment) => {
    setEquipmentToUpdate(equipment);
    setUpdateData({
      status: equipment.status,
      to_lab: '',
      transfer_date: new Date().toISOString().split('T')[0]
    });
    setActiveTab('status');
    setShowUpdateModal(true);
  };

  const handleUpdateConfirm = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    
    try {
      const token = getAuthToken();
      
      // Handle status update
      if (activeTab === 'status' && updateData.status && 
          ['available', 'in use', 'maintenance'].includes(updateData.status)) {
        await axios.patch(
          `http://localhost:8000/api/equipment/${equipmentToUpdate.id}/`,
          { status: updateData.status },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json'
            }
          }
        );
      } 
      // Handle transfer
      else if (activeTab === 'transfer' && updateData.to_lab) {
        // Create a transfer record
        const transferPayload = {
          equipment: equipmentToUpdate.id,
          from_lab: equipmentToUpdate.current_lab,
          to_lab: updateData.to_lab,
          transfer_date: new Date(updateData.transfer_date).toISOString(),
          is_synced: false
        };
        
        // Create the transfer record
        await axios.post('http://localhost:8000/api/asset-transfers/', transferPayload, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        // Update the equipment's current lab
        await axios.patch(
          `http://localhost:8000/api/equipment/${equipmentToUpdate.id}/`,
          { current_lab: updateData.to_lab },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        throw new Error('Invalid update data');
      }
      
      // Refresh equipment data
      await fetchEquipment();
      
      setSubmitLoading(false);
      setShowUpdateModal(false);
    } catch (err) {
      setSubmitError(`Failed to update equipment. ${err.message}`);
      setSubmitLoading(false);
      console.error('Error updating equipment:', err);
    }
  };

  const handleDeleteEquipment = (equipment) => {
    setEquipmentToDelete(equipment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = getAuthToken();
      await axios.delete(
        `http://localhost:8000/api/equipment/${equipmentToDelete.id}/`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        }
      );
      
      // Remove the deleted equipment from the list
      setEquipment(prevEquipment => 
        prevEquipment.filter(item => item.id !== equipmentToDelete.id)
      );
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting equipment:', err);
      setSubmitError('Failed to delete equipment. Please try again.');
    }
  };

  // Function to download QR code
  const handleDownloadQRCode = (qrCodeUrl, equipmentName) => {
    // Create a link element
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${equipmentName}_QR_Code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get unique labs for filter dropdown
  const uniqueLabs = useMemo(() => {
    return Array.isArray(equipment) 
      ? [...new Set(equipment.map(item => item.current_lab).filter(Boolean))]
      : [];
  }, [equipment]);

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available':
        return 'status-badge status-available';
      case 'in use':
        return 'status-badge status-in-use';
      case 'maintenance':
        return 'status-badge status-maintenance';
      default:
        return 'status-badge';
    }
  };

  // React Table Configuration
  const columns = useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <span className={getStatusBadgeClass(value)}>
          {value}
        </span>
      )
    },
    {
      Header: 'Current Lab',
      accessor: 'current_lab',
    },
    {
      Header: 'Unique Code',
      accessor: 'unique_code',
    },
    {
      Header: 'Next Maintenance',
      accessor: 'next_maintenance',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      Header: 'QR Code',
      accessor: 'qr_code',
      Cell: ({ value, row }) => value ? (
        <button 
          onClick={() => handleDownloadQRCode(value, row.original.name)}
          className="qr-download-button"
        >
          Download QR
        </button>
      ) : '-'
    },
    {
      Header: 'Actions',
      id: 'actions',
      Cell: ({ row }) => (
        <div className="actions-container">
          <button 
            onClick={() => handleEquipmentClick(row.original)}
            className="view-details-button"
          >
            View
          </button>
          <button 
            onClick={() => handleUpdateEquipment(row.original)}
            className="update-button"
          >
            Update
          </button>
          <button 
            onClick={() => handleDeleteEquipment(row.original)}
            className="delete-button"
          >
            Delete
          </button>
        </div>
      )
    }
  ], []);

  // Apply filters to the data
  const data = useMemo(() => {
    if (!Array.isArray(equipment)) return [];
    
    return equipment.filter(item => {
      return (
        (filterStatus === '' || item.status === filterStatus) &&
        (filterLab === '' || item.current_lab === filterLab)
      );
    });
  }, [equipment, filterStatus, filterLab]);

  // Initialize react-table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    { 
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    useFilters,
    useSortBy,
    usePagination
  );

  if (loading) {
    return <div className="loading-container">Loading equipment data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="equipment-container">
        <Sidebar />
        <Topbar />
      <h1 className="page-title">Laboratory Equipment</h1>
      <div className="actions-container-filter-container">
      <div className="actions-container">
        <button 
          className="add-equipment-button" 
          onClick={openAddModal}
        >
          Add Equipment
        </button>
      </div>
      
      {/* Filters */}
      <div className="filter-container">
        <div className="filter-item">
          <label htmlFor="status-filter" className="filter-label">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="in use">In Use</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        
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
            {uniqueLabs.map(lab => (
              <option key={lab} value={lab}>{lab}</option>
            ))}
          </select>
        </div>
      </div>
      </div>

      {/* React Table */}
      <div className="table-container">
        <table {...getTableProps()} className="equipment-table">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th 
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`table-header ${column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : ''}`}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="table-row">
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="table-cell">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Equipment Details Modal */}
      {selectedEquipment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{selectedEquipment.name}</h2>
              <button 
                onClick={closeDetails}
                className="close-button"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-details">
              <div className="detail-grid">
                <div className="detail-item">
                  <p className="detail-label">Status</p>
                  <p className={getStatusBadgeClass(selectedEquipment.status)}>
                    {selectedEquipment.status}
                  </p>
                </div>
                
                <div className="detail-item">
                  <p className="detail-label">Current Lab</p>
                  <p className="detail-value">{selectedEquipment.current_lab}</p>
                </div>
                
                <div className="detail-item">
                  <p className="detail-label">Unique Code</p>
                  <p className="detail-value">{selectedEquipment.unique_code}</p>
                </div>
                
                <div className="detail-item">
                  <p className="detail-label">Home Lab</p>
                  <p className="detail-value">{selectedEquipment.lab}</p>
                </div>
                
                {selectedEquipment.last_maintenance && (
                  <div className="detail-item">
                    <p className="detail-label">Last Maintenance</p>
                    <p className="detail-value">{new Date(selectedEquipment.last_maintenance).toLocaleDateString()}</p>
                  </div>
                )}
                
                {selectedEquipment.next_maintenance && (
                  <div className="detail-item">
                    <p className="detail-label">Next Maintenance</p>
                    <p className="detail-value">{new Date(selectedEquipment.next_maintenance).toLocaleDateString()}</p>
                  </div>
                )}
                
                {selectedEquipment.created_at && (
                  <div className="detail-item">
                    <p className="detail-label">Created At</p>
                    <p className="detail-value">{new Date(selectedEquipment.created_at).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              {selectedEquipment.description && (
                <div className="description-container">
                  <p className="detail-label">Description</p>
                  <p className="detail-description">{selectedEquipment.description}</p>
                </div>
              )}
              
              {selectedEquipment.qr_code && (
                <div className="qr-container">
                  <p className="detail-label">QR Code</p>
                  <div className="qr-image-container">
                    <img 
                      src={selectedEquipment.qr_code} 
                      alt="Equipment QR Code" 
                      className="qr-image"
                    />
                    <button 
                      onClick={() => handleDownloadQRCode(selectedEquipment.qr_code, selectedEquipment.name)}
                      className="qr-download-button"
                    >
                      Download QR Code
                    </button>
                  </div>
                </div>
              )}
              
              <div className="modal-actions">
                <button 
                  className="close-modal-button"
                  onClick={closeDetails}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add New Equipment</h2>
              <button 
                onClick={closeAddModal}
                className="close-button"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddEquipment} className="add-equipment-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Equipment Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newEquipment.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="unique_code" className="form-label">Unique Code*</label>
                  <input
                    type="text"
                    id="unique_code"
                    name="unique_code"
                    value={newEquipment.unique_code}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                  <small className="helper-text">This will be used to generate the QR code automatically.</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={newEquipment.status}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="available">Available</option>
                    <option value="in use">In Use</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="current_lab" className="form-label">Current Lab*</label>
                  <input
                    type="text"
                    id="current_lab"
                    name="current_lab"
                    value={newEquipment.current_lab}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lab" className="form-label">Home Lab</label>
                  <input
                    type="text"
                    id="lab"
                    name="lab"
                    value={newEquipment.lab}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="next_maintenance" className="form-label">Next Maintenance Date</label>
                  <input
                    type="date"
                    id="next_maintenance"
                    name="next_maintenance"
                    value={newEquipment.next_maintenance}
                    onChange={handleInputChange}
                    className="form-input"
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
                  onClick={() => document.getElementById("next_maintenance").showPicker()} // Open date picker
                />
                </div>

                <div className="form-group">
                  <label htmlFor="last-maintenance" className="form-label">Last Maintenance</label>
                    <input
                      type="date"
                      id="last-maintenance"
                      name="last_maintenance"
                      value={newEquipment.last_maintenance}
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
                  onClick={() => document.getElementById("last-maintenance").showPicker()} // Open date picker
                />
                </div>

              </div>
              
              <div className="form-group full-width">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newEquipment.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="4"
                />
              </div>
              
              {submitError && (
                <div className="error-message">{submitError}</div>
              )}
              
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={closeAddModal}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Adding...' : 'Add Equipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Equipment Modal (Combined Status & Transfer) */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Update Equipment</h2>
              <button 
                onClick={() => setShowUpdateModal(false)}
                className="close-button"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="tabs">
                <button 
                  className={`tab-button ${activeTab === 'status' ? 'active' : ''}`}
                  onClick={() => setActiveTab('status')}
                >
                  Update Status
                </button>
                <button 
                  className={`tab-button ${activeTab === 'transfer' ? 'active' : ''}`}
                  onClick={() => setActiveTab('transfer')}
                >
                  Transfer Equipment
                </button>
              </div>
              
              <div className="equipment-info-summary">
                <p><strong>Equipment:</strong> {equipmentToUpdate?.name}</p>
                <p><strong>Current Status:</strong> <span className={getStatusBadgeClass(equipmentToUpdate?.status)}>{equipmentToUpdate?.status}</span></p>
                <p><strong>Current Lab:</strong> {equipmentToUpdate?.current_lab}</p>
              </div>
              
              <form onSubmit={handleUpdateConfirm} className="update-form">
                {activeTab === 'status' && (
                  <div className="status-update-form">
                    <div className="form-group">
                      <label htmlFor="status" className="form-label">New Status*</label>
                      <select
                        id="status"
                        name="status"
                        value={updateData.status}
                        onChange={handleUpdateInputChange}
                        className="form-select"
                        required
                      >
                        <option value="available">Available</option>
                        <option value="in use">In Use</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>
                )}
                
                {activeTab === 'transfer' && (
                  <div className="transfer-update-form">
                    <div className="form-group">
                      <label htmlFor="to_lab" className="form-label">Destination Lab*</label>
                      <input
                        type="text"
                        id="to_lab"
                        name="to_lab"
                        value={updateData.to_lab}
                        onChange={handleUpdateInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="transfer_date" className="form-label">Transfer Date*</label>
                      <input
                        type="date"
                        id="transfer_date"
                        name="transfer_date"
                        value={updateData.transfer_date}
                        onChange={handleUpdateInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                )}
                
                {submitError && (
                  <div className="error-message">{submitError}</div>
                )}
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => setShowUpdateModal(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={submitLoading}
                  >
                    {submitLoading ? 'Processing...' : 'Update Equipment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Delete Equipment</h2>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="close-button"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{equipmentToDelete?.name}</strong>?</p>
              <div className="confirmation-buttons">
                <button 
                  className="confirm-button"
                  onClick={handleDeleteConfirm}
                >
                  Yes, Delete
                </button>
                <button 
                  className="cancel-button"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;