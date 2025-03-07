// import React, { useEffect, useState } from "react";
// import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
// import { FaEdit, FaTrash, FaQrcode, FaSearch, FaSort, FaSortUp, FaSortDown, FaExchangeAlt } from "react-icons/fa";
// import Sidebar from "/src/components/Admin/Sidebar.jsx";
// import Topbar from "/src/components/Admin/Topbar.jsx";
// import "/src/pages/Admin/styles/MedTechLab.css";

// const MedTechLab = () => {
//   const [equipment, setEquipment] = useState([]);
//   const [labs, setLabs] = useState([]); // New state for labs
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showQRModal, setShowQRModal] = useState(false);
//   const [showTransferModal, setShowTransferModal] = useState(false); // New state for transfer modal
//   const [currentItem, setCurrentItem] = useState(null);
//   const [submitError, setSubmitError] = useState("");
//   const [formData, setFormData] = useState({
//     id: "",
//     name: "",
//     current_lab: "",
//     home_lab: "",
//     status: "available",
//     qr_code: "",
//     quantity: 1,
//     unit_price: 0,
//     last_maintenance: "",
//     next_maintenance: "",
//     description: "",
//     to_lab: "", // New field for transfer modal
//   });

//   const statusOptions = ["available", "in_use", "maintenance"];

//   // Fetch equipment and labs data
//   useEffect(() => {
//     fetchEquipment();
//     fetchLabs(); // Fetch labs when the component mounts
//   }, []);

//   const fetchEquipment = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("http://localhost:8000/api/equipment/by-lab/3/", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch equipment data");
//       }

//       const data = await response.json();
//       console.log("Full Equipment Data:", JSON.stringify(data, null, 2));
//       setEquipment(data);
//     } catch (error) {
//       console.error("Error fetching equipment:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchLabs = async () => {
//     try {
//       const response = await fetch('http://localhost:8000/api/labs/', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch labs');
//       }

//       const data = await response.json();
//       setLabs(data); // Set the labs state with the fetched data
//     } catch (error) {
//       console.error('Error fetching labs:', error);
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle edit click
//   const handleEditClick = (item) => {
//     setFormData({
//       id: item.id,
//       name: item.name,
//       unit_price: item.unit_price,
//       current_lab: item.current_lab,
//       home_lab: item.home_lab,
//       status: item.status,
//       qr_code: item.qr_code,
//       quantity: item.quantity,
//       last_maintenance: item.last_maintenance || "",
//       next_maintenance: item.next_maintenance || "",
//       description: item.description,
//     });
//     setCurrentItem(item);
//     setShowEditModal(true);
//   };

//   // Handle delete click
//   const handleDeleteClick = (item) => {
//     setCurrentItem(item);
//     setShowDeleteConfirm(true);
//   };

//   // Handle QR code click
//   const handleQRCodeClick = (item) => {
//     setCurrentItem(item);
//     setShowQRModal(true);
//   };

//   // Handle transfer click
//   const handleTransferClick = (item) => {
//     setCurrentItem(item);
//     setShowTransferModal(true);
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       id: "",
//       name: "",
//       current_lab: "",
//       home_lab: "",
//       status: "available",
//       qr_code: "",
//       quantity: 1,
//       unit_price: 0,
//       last_maintenance: "",
//       next_maintenance: "",
//       description: "",
//       to_lab: "", // Reset the transfer lab field
//     });
//     setSubmitError("");
//   };

//   // Add new equipment
//   const handleAddEquipment = async (e) => {
//     e.preventDefault();

//     const payload = {
//       name: formData.name,
//       unit_price: formData.unit_price,
//       current_lab_id: parseInt(formData.current_lab, 10),
//       home_lab_id: parseInt(formData.home_lab, 10),
//       quantity: parseInt(formData.quantity, 10),
//       last_maintenance: formData.last_maintenance || null,
//       next_maintenance: formData.next_maintenance || null,
//       description: formData.description,
//       status: formData.status,
//     };

//     try {
//       const response = await fetch("http://localhost:8000/api/equipment/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to add equipment");
//       }

//       const newItem = await response.json();
//       setEquipment([...equipment, newItem]);
//       setShowAddModal(false);
//       resetForm();
//     } catch (error) {
//       setSubmitError(error.message || "Failed to add equipment. Please try again.");
//       console.error("Error adding equipment:", error);
//     }
//   };

//   // Update equipment
//   const handleUpdateEquipment = async (e) => {
//     e.preventDefault();

//     const payload = {
//       name: formData.name,
//       unit_price: formData.unit_price,
//       current_lab_id: parseInt(formData.current_lab, 10),
//       home_lab_id: parseInt(formData.home_lab, 10),
//       quantity: parseInt(formData.quantity, 10),
//       last_maintenance: formData.last_maintenance || null,
//       next_maintenance: formData.next_maintenance || null,
//       description: formData.description,
//       status: formData.status,
//     };

//     try {
//       const response = await fetch(`http://localhost:8000/api/equipment/${currentItem.id}/`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update equipment");
//       }

//       const updatedItem = await response.json();
//       setEquipment((prevEquipment) =>
//         prevEquipment.map((item) =>
//           item.id === currentItem.id ? { ...item, ...payload } : item
//         )
//       );
//       setShowEditModal(false);
//       resetForm();
//     } catch (error) {
//       setSubmitError("Failed to update equipment. Please try again.");
//       console.error("Error updating equipment:", error);
//     }
//   };

//   // Delete equipment
//   const handleDeleteEquipment = async () => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/equipment/${currentItem.id}/`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete equipment");
//       }

//       setEquipment(equipment.filter((item) => item.id !== currentItem.id));
//       setShowDeleteConfirm(false);
//       setCurrentItem(null);
//     } catch (error) {
//       console.error("Error deleting equipment:", error);
//     }
//   };

//   // Handle transfer equipment
//   const handleTransferEquipment = async (e) => {
//     e.preventDefault();

//     const payload = {
//       equipment_id: currentItem.id, // Use the equipment ID from the current item
//       to_lab: formData.to_lab, // Use the selected lab name
//     };

//     try {
//       const response = await fetch('http://localhost:8000/api/transfer-equipment/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to transfer equipment');
//       }

//       // Update the equipment list with the new data
//       const updatedItem = await response.json();
//       setEquipment((prevEquipment) =>
//         prevEquipment.map((item) =>
//           item.id === currentItem.id ? { ...item, current_lab: formData.to_lab } : item
//         )
//       );

//       // Close the transfer modal and reset the form
//       setShowTransferModal(false);
//       resetForm();
//     } catch (error) {
//       setSubmitError(error.message || 'Failed to transfer equipment. Please try again.');
//       console.error('Error transferring equipment:', error);
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "Not scheduled";
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   // Define table columns
//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "Name",
//         accessor: "name",
//       },
//       {
//         Header: "Description",
//         accessor: "description",
//         Cell: ({ value }) => <span className="equipment-description">{value}</span>,
//       },
//       {
//         Header: "Quantity",
//         accessor: "quantity",
//       },
//       {
//         Header: "Total Price",
//         accessor: "total_price",
//         Cell: ({ value }) => `$${value}`,
//       },
//       {
//         Header: "Unit Price",
//         accessor: "unit_price",
//         Cell: ({ value }) => `$${value}`,
//       },
//       {
//         Header: "Status",
//         accessor: "status",
//         Cell: ({ value }) => (
//           <span className={`status-badge status-${value.replace(/\s+/g, "-")}`}>{value}</span>
//         ),
//       },
//       {
//         Header: "Home Lab",
//         accessor: "home_lab",
//         Cell: ({ value }) => {
//           // If the value is exactly "Design Studio", return it
//           if (value === "Design Studio") return value;
          
//           // If it's "Unknown Lab", try to find a match
//           const lab = labs.find(lab => 
//             lab.name.toLowerCase().includes(value.toLowerCase())
//           );
          
//           return lab ? lab.name : value;
//         },
//       },
//       {
//         Header: "Current Lab",
//         accessor: "current_lab",
//         Cell: ({ value }) => {
//           // If the value is already a valid lab name, return it
//           const validLabNames = labs.map(lab => lab.name);
//           if (validLabNames.includes(value)) return value;
          
//           // Try to find a match in the lab options
//           const lab = labs.find(lab => 
//             lab.name.toLowerCase().includes(value.toLowerCase())
//           );
          
//           return lab ? lab.name : value;
//         },
//       },
//       {
//         Header: "Last Maintenance",
//         accessor: "last_maintenance",
//         Cell: ({ value }) => formatDate(value),
//       },
//       {
//         Header: "Next Maintenance",
//         accessor: "next_maintenance",
//         Cell: ({ value }) => formatDate(value),
//       },
//       {
//         Header: "Actions",
//         accessor: "actions",
//         disableSortBy: true,
//         Cell: ({ row }) => (
//           <div className="action-buttons">
//             <button
//               className="action-button qr-button"
//               onClick={() => handleQRCodeClick(row.original)}
//               title="View QR Code"
//             >
//               <FaQrcode />
//             </button>
//             <button
//               className="action-button edit-button"
//               onClick={() => handleEditClick(row.original)}
//               title="Edit Equipment"
//             >
//               <FaEdit />
//             </button>
//             <button
//               className="action-button delete-button"
//               onClick={() => handleDeleteClick(row.original)}
//               title="Delete Equipment"
//             >
//               <FaTrash />
//             </button>
//             <button
//               className="action-button transfer-button"
//               onClick={() => handleTransferClick(row.original)}
//               title="Transfer Equipment"
//             >
//               <FaExchangeAlt />
//             </button>
//           </div>
//         ),
//       },
//     ],
//     [labs]
//   );

//   // Table setup
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     page,
//     prepareRow,
//     state,
//     setGlobalFilter,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//     pageOptions,
//     gotoPage,
//     pageCount,
//     setPageSize,
//   } = useTable(
//     {
//       columns,
//       data: equipment,
//       initialState: { pageIndex: 0, pageSize: 10 },
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   const { pageIndex, pageSize } = state;

//   useEffect(() => {
//     setGlobalFilter(searchTerm);
//   }, [searchTerm, setGlobalFilter]);

//   if (isLoading) {
//     return (
//       <div className="medtech-lab-container">
//         <Sidebar />
//         <div className="main-content">
//           <Topbar />
//           <div className="loading-container">
//             <div className="loading-spinner"></div>
//             <p>Loading equipment data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="medtech-lab-container">
//       <Sidebar />
//       <div className="main-content">
//         <Topbar />

//         <div className="content-header">
//           <h1>Cezeri Lab Equipment Management</h1>
//           <p>Manage all equipment in the Cezeri Lab</p>
//         </div>

//         <div className="actions-container">
//           <div className="search-container">
//             <FaSearch className="search-icon" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search equipment..."
//               className="search-input"
//             />
//           </div>
//           <button className="add-button" onClick={() => setShowAddModal(true)}>
//             Add New Equipment
//           </button>
//         </div>

//         <div className="table-container">
//           <table {...getTableProps()} className="equipment-table">
//             <thead>
//               {headerGroups.map((headerGroup) => (
//                 <tr {...headerGroup.getHeaderGroupProps()}>
//                   {headerGroup.headers.map((column) => (
//                     <th {...column.getHeaderProps(column.getSortByToggleProps())}>
//                       <div className="header-content">
//                         {column.render("Header")}
//                         <span className="sort-icon">
//                           {column.canSort ? (
//                             column.isSorted ? (
//                               column.isSortedDesc ? (
//                                 <FaSortDown />
//                               ) : (
//                                 <FaSortUp />
//                               )
//                             ) : (
//                               <FaSort />
//                             )
//                           ) : null}
//                         </span>
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//               {page.length === 0 ? (
//                 <tr>
//                   <td colSpan={columns.length} className="no-data">
//                     No equipment found. Add some equipment to get started.
//                   </td>
//                 </tr>
//               ) : (
//                 page.map((row) => {
//                   prepareRow(row);
//                   return (
//                     <tr {...row.getRowProps()}>
//                       {row.cells.map((cell) => (
//                         <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
//                       ))}
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Controls */}
//         <div className="pagination-controls">
//           <div className="pagination-info">
//             Showing {page.length} of {equipment.length} results
//           </div>
//           <div className="pagination-buttons">
//             <button
//               onClick={() => gotoPage(0)}
//               disabled={!canPreviousPage}
//               className="pagination-button"
//             >
//               {"<<"}
//             </button>
//             <button
//               onClick={() => previousPage()}
//               disabled={!canPreviousPage}
//               className="pagination-button"
//             >
//               {"<"}
//             </button>
//             <span className="pagination-page-info">
//               Page <strong>{pageIndex + 1}</strong> of <strong>{pageOptions.length}</strong>
//             </span>
//             <button
//               onClick={() => nextPage()}
//               disabled={!canNextPage}
//               className="pagination-button"
//             >
//               {">"}
//             </button>
//             <button
//               onClick={() => gotoPage(pageCount - 1)}
//               disabled={!canNextPage}
//               className="pagination-button"
//             >
//               {">>"}
//             </button>
//             <select
//               value={pageSize}
//               onChange={(e) => {
//                 setPageSize(Number(e.target.value));
//               }}
//               className="pagination-size-select"
//             >
//               {[10, 25, 50].map((size) => (
//                 <option key={size} value={size}>
//                   Show {size}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Add Equipment Modal */}
//         {showAddModal && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h2 className="modal-title">Add New Equipment</h2>
//                 <button
//                   className="close-button"
//                   onClick={() => {
//                     setShowAddModal(false);
//                     resetForm();
//                   }}
//                 >
                 
//                   ✕
//                 </button>
//               </div>
//               <form onSubmit={handleUpdateEquipment} className="equipment-form">
//                 <div className="form-group">
//                   <label htmlFor="edit-name">Name</label>
//                   <input
//                     type="text"
//                     id="edit-name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="edit-description">Description</label>
//                   <textarea
//                     id="edit-description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows="3"
//                   ></textarea>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group half">
//                     <label htmlFor="edit-quantity">Quantity</label>
//                     <input
//                       type="number"
//                       id="edit-quantity"
//                       name="quantity"
//                       min="1"
//                       value={formData.quantity}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <div className="form-group half">
//                     <label htmlFor="edit-total_price">Total Price</label>
//                     <input
//                       type="number"
//                       id="edit-total_price"
//                       name="total_price"
//                       value={formData.total_price}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group half">
//                     <label htmlFor="edit-status">Status</label>
//                     <select
//                       id="edit-status"
//                       name="status"
//                       value={formData.status}
//                       onChange={handleInputChange}
//                     >
//                       {statusOptions.map((option) => (
//                         <option key={option} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="form-group half">
//                     <label htmlFor="edit-home_lab">Home Lab</label>
//                     <select
//                       id="edit-home_lab"
//                       name="home_lab"
//                       value={formData.home_lab}
//                       onChange={handleInputChange}
//                     >
//                       <option value="">Select a lab</option>
//                       {labOptions.map((lab) => (
//                         <option key={lab.id} value={lab.id}>
//                           {lab.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group half">
//                     <label htmlFor="edit-current_lab">Current Lab</label>
//                     <select
//                       id="edit-current_lab"
//                       name="current_lab"
//                       value={formData.current_lab}
//                       onChange={handleInputChange}
//                     >
//                       <option value="">Select a lab</option>
//                       {labOptions.map((lab) => (
//                         <option key={lab.id} value={lab.id}>
//                           {lab.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group half">
//                     <label htmlFor="edit-last_maintenance">Last Maintenance Date</label>
//                     <input
//                       type="date"
//                       id="edit-last_maintenance"
//                       name="last_maintenance"
//                       value={formData.last_maintenance}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <div className="form-group half">
//                     <label htmlFor="edit-next_maintenance">Next Maintenance Date</label>
//                     <input
//                       type="date"
//                       id="edit-next_maintenance"
//                       name="next_maintenance"
//                       value={formData.next_maintenance}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                 </div>

//                 {submitError && <div className="error-message">{submitError}</div>}

//                 <div className="form-actions">
//                   <button
//                     type="button"
//                     className="cancel-button"
//                     onClick={() => {
//                       setShowEditModal(false);
//                       resetForm();
//                     }}
//                   >
//                     Cancel
//                   </button>
//                   <button type="submit" className="submit-button">
//                     Update Equipment
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         {showDeleteConfirm && currentItem && (
//           <div className="modal-overlay">
//             <div className="modal-content delete-confirm-modal">
//               <div className="modal-header">
//                 <h2 className="modal-title">Confirm Delete</h2>
//                 <button
//                   className="close-button"
//                   onClick={() => setShowDeleteConfirm(false)}
//                 >
//                   ✕
//                 </button>
//               </div>
//               <div className="confirm-message">
//                 <p>
//                   Are you sure you want to delete <strong>{currentItem.name}</strong>?
//                 </p>
//                 <p>This action cannot be undone.</p>
//               </div>
//               <div className="form-actions">
//                 <button
//                   type="button"
//                   className="cancel-button"
//                   onClick={() => setShowDeleteConfirm(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="delete-confirm-button"
//                   onClick={handleDeleteEquipment}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* QR Code Modal */}
//         {showQRModal && currentItem && (
//           <div className="modal-overlay">
//             <div className="modal-content qr-modal">
//               <div className="modal-header">
//                 <h2 className="modal-title">Equipment QR Code</h2>
//                 <button
//                   className="close-button"
//                   onClick={() => setShowQRModal(false)}
//                 >
//                   ✕
//                 </button>
//               </div>
//               <div className="qr-content">
//                 <div className="qr-code-container">
//                   <img
//                     src={currentItem.qr_code}
//                     alt={`QR Code for ${currentItem.name}`}
//                     className="qr-code-image"
//                   />
//                 </div>
//                 <div className="qr-details">
//                   <h3>{currentItem.name}</h3>
//                   <p className="qr-description">{currentItem.description}</p>
//                   <p>
//                     <strong>ID:</strong> {currentItem.id}
//                   </p>
//                   <p>
//                     <strong>Home Lab:</strong> {currentItem.home_lab}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//                 {/* Transfer Equipment Modal */}
//                 {showTransferModal && currentItem && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h2 className="modal-title">Transfer Equipment</h2>
//                 <button
//                   className="close-button"
//                   onClick={() => setShowTransferModal(false)}
//                 >
//                   ✕
//                 </button>
//               </div>
//               <form onSubmit={handleTransferEquipment} className="equipment-form">
//                 <div className="form-group">
//                   <label htmlFor="to_lab">Transfer To Lab*</label>
//                   <select
//                     id="to_lab"
//                     name="to_lab"
//                     value={formData.to_lab}
//                     onChange={handleInputChange}
//                     required
//                   >
//                     <option value="">Select a lab</option>
//                     {labs.map((lab) => (
//                       <option key={lab.id} value={lab.name}>
//                         {lab.description}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {submitError && <div className="error-message">{submitError}</div>}

//                 <div className="form-actions">
//                   <button
//                     type="button"
//                     className="cancel-button"
//                     onClick={() => setShowTransferModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button type="submit" className="submit-button">
//                     Transfer Equipment
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MedTechLab;



import React, { useEffect, useState } from "react";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { FaEdit, FaTrash, FaQrcode, FaSearch, FaSort, FaSortUp, FaSortDown, FaExchangeAlt } from "react-icons/fa";
import Sidebar from "/src/components/LabTechnician/LabTechnicianSidebar.jsx";
import Topbar from "/src/components/LabTechnician/LabTechnicianTopbar.jsx";
import "/src/pages/LabTechnician/styles/MedTechLab.css";

const MedTechLab = () => {
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]); // New state for labs
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false); // New state for transfer modal
  const [currentItem, setCurrentItem] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    current_lab: "",
    home_lab: "",
    status: "available",
    qr_code: "",
    quantity: 1,
    unit_price: 0,
    last_maintenance: "",
    next_maintenance: "",
    description: "",
    to_lab: "", // New field for transfer modal
  });

  const statusOptions = ["available", "in_use", "maintenance"];
  const labOptions = [
    { id: 1, name: 'Design Studio Lab' },
    { id: 2, name: 'MedTech Lab' },
    { id: 3, name: 'Cezeri Lab' },
  ];
  // Fetch equipment and labs data
  useEffect(() => {
    fetchEquipment();
    fetchLabs(); // Fetch labs when the component mounts
  }, []);

  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/equipment/by-lab/3/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch equipment data");
      }

      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLabs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/labs/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch labs');
      }

      const data = await response.json();
      setLabs(data); // Set the labs state with the fetched data
    } catch (error) {
      console.error('Error fetching labs:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle edit click
  const handleEditClick = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      unit_price: item.unit_price,
      current_lab: item.current_lab,
      home_lab: item.home_lab,
      status: item.status,
      qr_code: item.qr_code,
      quantity: item.quantity,
      last_maintenance: item.last_maintenance || "",
      next_maintenance: item.next_maintenance || "",
      description: item.description,
    });
    setCurrentItem(item);
    setShowEditModal(true);
  };

  // Handle delete click
  const handleDeleteClick = (item) => {
    setCurrentItem(item);
    setShowDeleteConfirm(true);
  };

  // Handle QR code click
  const handleQRCodeClick = (item) => {
    setCurrentItem(item);
    setShowQRModal(true);
  };

  // Handle transfer click
  const handleTransferClick = (item) => {
    setCurrentItem(item);
    setShowTransferModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      current_lab: "",
      home_lab: "",
      status: "available",
      qr_code: "",
      quantity: 1,
      unit_price: 0,
      last_maintenance: "",
      next_maintenance: "",
      description: "",
      to_lab: "", // Reset the transfer lab field
    });
    setSubmitError("");
  };

  // Add new equipment
  const handleAddEquipment = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      unit_price: formData.unit_price,
      current_lab_id: parseInt(formData.current_lab, 10),
      home_lab_id: parseInt(formData.home_lab, 10),
      quantity: parseInt(formData.quantity, 10),
      last_maintenance: formData.last_maintenance || null,
      next_maintenance: formData.next_maintenance || null,
      description: formData.description,
      status: formData.status,
    };

    try {
      const response = await fetch("http://localhost:8000/api/equipment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add equipment");
      }

      const newItem = await response.json();
      setEquipment([...equipment, newItem]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      setSubmitError(error.message || "Failed to add equipment. Please try again.");
      console.error("Error adding equipment:", error);
    }
  };

  // Update equipment
  const handleUpdateEquipment = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      unit_price: formData.unit_price,
      current_lab_id: parseInt(formData.current_lab, 10),
      home_lab_id: parseInt(formData.home_lab, 10),
      quantity: parseInt(formData.quantity, 10),
      last_maintenance: formData.last_maintenance || null,
      next_maintenance: formData.next_maintenance || null,
      description: formData.description,
      status: formData.status,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/equipment/${currentItem.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update equipment");
      }

      const updatedItem = await response.json();
      setEquipment((prevEquipment) =>
        prevEquipment.map((item) =>
          item.id === currentItem.id ? { ...item, ...payload } : item
        )
      );
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      setSubmitError("Failed to update equipment. Please try again.");
      console.error("Error updating equipment:", error);
    }
  };

  // Delete equipment
  const handleDeleteEquipment = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/equipment/${currentItem.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete equipment");
      }

      setEquipment(equipment.filter((item) => item.id !== currentItem.id));
      setShowDeleteConfirm(false);
      setCurrentItem(null);
    } catch (error) {
      console.error("Error deleting equipment:", error);
    }
  };

  // Handle transfer equipment
  const handleTransferEquipment = async (e) => {
    e.preventDefault();

    const payload = {
      equipment_id: currentItem.id, // Use the equipment ID from the current item
      to_lab: formData.to_lab, // Use the selected lab name
    };

    try {
      const response = await fetch('http://localhost:8000/api/transfer-equipment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to transfer equipment');
      }

      // Update the equipment list with the new data
      const updatedItem = await response.json();
      setEquipment((prevEquipment) =>
        prevEquipment.map((item) =>
          item.id === currentItem.id ? { ...item, current_lab: formData.to_lab } : item
        )
      );

      // Close the transfer modal and reset the form
      setShowTransferModal(false);
      resetForm();
    } catch (error) {
      setSubmitError(error.message || 'Failed to transfer equipment. Please try again.');
      console.error('Error transferring equipment:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Define table columns
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => <span className="equipment-description">{value}</span>,
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Total Price",
        accessor: "total_price",
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: "Unit Price",
        accessor: "unit_price",
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span className={`status-badge status-${value.replace(/\s+/g, "-")}`}>{value}</span>
        ),
      },
      {
        Header: "Home Lab",
        accessor: "home_lab",
      },
      {
        Header: "Current Lab",
        accessor: "current_lab",
      },
      {
        Header: "Last Maintenance",
        accessor: "last_maintenance",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Next Maintenance",
        accessor: "next_maintenance",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button
              className="action-button qr-button"
              onClick={() => handleQRCodeClick(row.original)}
              title="View QR Code"
            >
              <FaQrcode />
            </button>
            <button
              className="action-button edit-button"
              onClick={() => handleEditClick(row.original)}
              title="Edit Equipment"
            >
              <FaEdit />
            </button>
            <button
              className="action-button delete-button"
              onClick={() => handleDeleteClick(row.original)}
              title="Delete Equipment"
            >
              <FaTrash />
            </button>
            <button
              className="action-button transfer-button"
              onClick={() => handleTransferClick(row.original)}
              title="Transfer Equipment"
            >
              <FaExchangeAlt />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Table setup
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data: equipment,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  useEffect(() => {
    setGlobalFilter(searchTerm);
  }, [searchTerm, setGlobalFilter]);

  if (isLoading) {
    return (
      <div className="medtech-lab-container">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading equipment data...</p>
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
          <h1>Cezeri Lab Equipment Management</h1>
           <p>Manage all equipment in the Cezeri Lab</p>
        </div>

        <div className="actions-container">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search equipment..."
              className="search-input"
            />
          </div>
          <button className="add-button" onClick={() => setShowAddModal(true)}>
            Add New Equipment
          </button>
        </div>

        <div className="table-container">
          <table {...getTableProps()} className="equipment-table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      <div className="header-content">
                        {column.render("Header")}
                        <span className="sort-icon">
                          {column.canSort ? (
                            column.isSorted ? (
                              column.isSortedDesc ? (
                                <FaSortDown />
                              ) : (
                                <FaSortUp />
                              )
                            ) : (
                              <FaSort />
                            )
                          ) : null}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="no-data">
                    No equipment found. Add some equipment to get started.
                  </td>
                </tr>
              ) : (
                page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing {page.length} of {equipment.length} results
          </div>
          <div className="pagination-buttons">
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="pagination-button"
            >
              {"<<"}
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="pagination-button"
            >
              {"<"}
            </button>
            <span className="pagination-page-info">
              Page <strong>{pageIndex + 1}</strong> of <strong>{pageOptions.length}</strong>
            </span>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="pagination-button"
            >
              {">"}
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="pagination-button"
            >
              {">>"}
            </button>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
              className="pagination-size-select"
            >
              {[10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Equipment Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Add New Equipment</h2>
                <button
                  className="close-button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddEquipment} className="equipment-form">
                <div className="form-group">
                  <label htmlFor="name">Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description*</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="quantity">Quantity*</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group half">
                    <label htmlFor="unit_price">Unit Price</label>
                    <input
                      type="number"
                      id="unit_price"
                      name="unit_price"
                      value={formData.unit_price}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="status">Status*</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group half">
                    <label htmlFor="home_lab">Home Lab*</label>
                    <select
                      id="home_lab"
                      name="home_lab"
                      value={formData.home_lab}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a lab</option>
                      {labOptions.map(lab => (
                        <option key={lab.id} value={lab.id}>
                          {lab.name}
                        </option>
                      ))}
                     
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="current_lab">Current Lab*</label>
                    <select
                      id="current_lab"
                      name="current_lab"
                      value={formData.current_lab}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a lab</option>
                      {labOptions.map(lab => (
                        <option key={lab.id} value={lab.id}>
                          {lab.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="last_maintenance">Last Maintenance Date</label>
                    <input
                      type="date"
                      id="last_maintenance"
                      name="last_maintenance"
                      value={formData.last_maintenance}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group half">
                    <label htmlFor="next_maintenance">Next Maintenance Date</label>
                    <input
                      type="date"
                      id="next_maintenance"
                      name="next_maintenance"
                      value={formData.next_maintenance}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {submitError && <div className="error-message">{submitError}</div>}

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Add Equipment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Equipment Modal */}
        {showEditModal && currentItem && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Edit Equipment</h2>
                <button
                  className="close-button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleUpdateEquipment} className="equipment-form">
                <div className="form-group">
                  <label htmlFor="edit-name">Name</label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-description">Description</label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="edit-quantity">Quantity</label>
                    <input
                      type="number"
                      id="edit-quantity"
                      name="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group half">
                    <label htmlFor="edit-unit_price">Unit Price</label>
                    <input
                      type="number"
                      id="edit-unit_price"
                      name="unit_price"
                      value={formData.unit_price}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="edit-status">Status</label>
                    <select
                      id="edit-status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group half">
                    <label htmlFor="edit-home_lab">Home Lab</label>
                    <select
                      id="edit-home_lab"
                      name="home_lab"
                      value={formData.home_lab}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a lab</option>
                      {labOptions.map(lab => (
                        <option key={lab.id} value={lab.id}>
                          {lab.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="edit-current_lab">Current Lab</label>
                    <select
                      id="edit-current_lab"
                      name="current_lab"
                      value={formData.current_lab}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a lab</option>
                      {labOptions.map(lab => (
                        <option key={lab.id} value={lab.id}>
                          {lab.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="edit-last_maintenance">Last Maintenance Date</label>
                    <input
                      type="date"
                      id="edit-last_maintenance"
                      name="last_maintenance"
                      value={formData.last_maintenance}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group half">
                    <label htmlFor="edit-next_maintenance">Next Maintenance Date</label>
                    <input
                      type="date"
                      id="edit-next_maintenance"
                      name="next_maintenance"
                      value={formData.next_maintenance}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {submitError && <div className="error-message">{submitError}</div>}

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Update Equipment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && currentItem && (
          <div className="modal-overlay">
            <div className="modal-content delete-confirm-modal">
              <div className="modal-header">
                <h2 className="modal-title">Confirm Delete</h2>
                <button
                  className="close-button"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  ✕
                </button>
              </div>
              <div className="confirm-message">
                <p>
                  Are you sure you want to delete <strong>{currentItem.name}</strong>?
                </p>
                <p>This action cannot be undone.</p>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="delete-confirm-button"
                  onClick={handleDeleteEquipment}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQRModal && currentItem && (
          <div className="modal-overlay">
            <div className="modal-content qr-modal">
              <div className="modal-header">
                <h2 className="modal-title">Equipment QR Code</h2>
                <button
                  className="close-button"
                  onClick={() => setShowQRModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="qr-content">
                <div className="qr-code-container">
                  <img
                    src={currentItem.qr_code}
                    alt={`QR Code for ${currentItem.name}`}
                    className="qr-code-image"
                  />
                </div>
                <div className="qr-details">
                  <h3>{currentItem.name}</h3>
                  <p className="qr-description">{currentItem.description}</p>
                  <p>
                    <strong>ID:</strong> {currentItem.id}
                  </p>
                  <p>
                    <strong>Home Lab:</strong> {currentItem.home_lab}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Equipment Modal */}
        {showTransferModal && currentItem && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Transfer Equipment</h2>
                <button
                  className="close-button"
                  onClick={() => setShowTransferModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleTransferEquipment} className="equipment-form">
                <div className="form-group">
                  <label htmlFor="to_lab">Transfer To Lab*</label>
                  <select
                    id="to_lab"
                    name="to_lab"
                    value={formData.to_lab}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a lab</option>
                    {labs.map((lab) => (
                      <option key={lab.id} value={lab.name}>
                        {lab.description}
                      </option>
                    ))}
                  </select>
                </div>

                {submitError && <div className="error-message">{submitError}</div>}

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowTransferModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Transfer Equipment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedTechLab;