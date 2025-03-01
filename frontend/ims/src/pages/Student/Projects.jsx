// import React, { useState, useEffect } from "react";
// import '/src/pages/Student/styles/Projects.css';
// import Sidebar from "/src/components/Student/StudentSidebar.jsx";
// import Topbar from "/src/components/Student/StudentTopbar.jsx";
// import { useTable } from "react-table";
// import { FaCalendarAlt } from "react-icons/fa";
// import axios from "axios"; // Make sure to install axios: npm install axios

// const Project = () => {
//   const [projects, setProjects] = useState([]);
//   const [showAddProjectPopup, setShowAddProjectPopup] = useState(false);
//   const [showProjectDetailsPopup, setShowProjectDetailsPopup] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showDeleteConfirmationPopup, setShowDeleteConfirmationPopup] = useState(false);
//   const [projectToDelete, setProjectToDelete] = useState(null); // Store the project ID to delete
//   const [showEditStatusPopup, setShowEditStatusPopup] = useState(false); // State for edit status popup
//   const [projectToEdit, setProjectToEdit] = useState(null); // Store the project to edit
//   const [newStatus, setNewStatus] = useState("pending"); // Store the new status

//   // Form state for adding a new project
//   const [projectTitle, setProjectTitle] = useState("");
//   const [projectDescription, setProjectDescription] = useState("");
//   const [projectStartDate, setProjectStartDate] = useState("");
//   const [projectEndDate, setProjectEndDate] = useState("");
//   const [projectStatus, setProjectStatus] = useState("pending");

//   // Configuration for API requests with auth token
//   const getAuthConfig = () => ({
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

//   // Fetch projects from the backend
//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get('http://localhost:8000/api/projects/', getAuthConfig());
//       // Ensure projects is always an array
//       setProjects(Array.isArray(response.data) ? response.data : []);
//       setIsLoading(false);
//     } catch (err) {
//       console.error("Error fetching projects:", err);
//       setError("Failed to load projects. Please try again later.");
//       setProjects([]); // Ensure projects is reset to an empty array on error
//       setIsLoading(false);
//     }
//   };

//   // Add a new project
//   const addProject = async () => {
//     if (projectTitle && projectStartDate) {
//       try {
//         const projectData = {
//           title: projectTitle,
//           description: projectDescription,
//           start_date: projectStartDate,
//           end_date: projectEndDate || null,
//           status: projectStatus
//         };

//         await axios.post('http://localhost:8000/api/projects/', projectData, getAuthConfig());
//         fetchProjects(); // Refresh the project list
//         setShowAddProjectPopup(false); // Close the popup
//         resetForm(); // Reset the form fields
//       } catch (err) {
//         console.error("Error adding project:", err);
//         alert("Failed to add project. Please try again.");
//       }
//     } else {
//       alert("Project title and start date are required.");
//     }
//   };

//   // Delete a project
//   const deleteProject = (projectId) => {
//     setProjectToDelete(projectId); // Set the project ID to delete
//     setShowDeleteConfirmationPopup(true); // Show the delete confirmation popup
//   };

//   // Reset the form fields
//   const resetForm = () => {
//     setProjectTitle("");
//     setProjectDescription("");
//     setProjectStartDate("");
//     setProjectEndDate("");
//     setProjectStatus("pending");
//   };

//   // Open project details popup
//   const openProjectDetails = (project) => {
//     setSelectedProject(project);
//     setShowProjectDetailsPopup(true);
//   };

//   // Open edit status popup
//   const openEditStatusPopup = (project) => {
//     setProjectToEdit(project);
//     setNewStatus(project.status); // Set the current status as the default value
//     setShowEditStatusPopup(true);
//   };

//   // Update project status
//   const updateProjectStatus = async () => {
//     if (projectToEdit && newStatus) {
//       try {
//         const updatedProject = { ...projectToEdit, status: newStatus };
//         await axios.put(`http://localhost:8000/api/projects/${projectToEdit.id}/`, updatedProject, getAuthConfig());
//         fetchProjects(); // Refresh the project list
//         setShowEditStatusPopup(false); // Close the popup
//         setProjectToEdit(null); // Reset the project to edit
//       } catch (err) {
//         console.error("Error updating project status:", err);
//         alert("Failed to update project status. Please try again.");
//       }
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return "Not set";
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   // Define columns for the table
//   const columns = React.useMemo(
//     () => [
//       { Header: "ID", accessor: "id" },
//       { Header: "Title", accessor: "title" },
//       { 
//         Header: "Start Date", 
//         accessor: "start_date",
//         Cell: ({ value }) => formatDate(value)
//       },
//       { 
//         Header: "End Date", 
//         accessor: "end_date",
//         Cell: ({ value }) => formatDate(value)
//       },
//       { 
//         Header: "Status", 
//         accessor: "status",
//         Cell: ({ value }) => (
//           <span className={`status-badge status-${value?.toLowerCase() || 'pending'}`}>
//             {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Pending'}
//           </span>
//         )
//       },
//       {
//         Header: "Actions",
//         accessor: "actions",
//         Cell: ({ row }) => (
//           <div className="actions">
//             <button
//               className="view-details-button"
//               onClick={() => openProjectDetails(row.original)}
//             >
//               View Details
//             </button>
//             <button
//               className="edit-button"
//               onClick={() => openEditStatusPopup(row.original)}
//             >
//               Edit
//             </button>
//             <button
//               className="delete-button"
//               onClick={() => deleteProject(row.original.id)}
//             >
//               Delete
//             </button>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   // Handle filter change
//   const [statusFilter, setStatusFilter] = useState("all");
  
//   const filteredProjects = React.useMemo(() => {
//     // Ensure projects is an array
//     if (!Array.isArray(projects)) return [];
    
//     if (statusFilter === "all") return projects;
//     return projects.filter(project => project.status === statusFilter);
//   }, [projects, statusFilter]);

//   // Use React Table with safeguard for data
//   const tableData = React.useMemo(() => 
//     Array.isArray(filteredProjects) ? filteredProjects : [], 
//     [filteredProjects]
//   );
  
//   const tableInstance = useTable({ 
//     columns, 
//     data: tableData
//   });
  
//   const { 
//     getTableProps, 
//     getTableBodyProps, 
//     headerGroups, 
//     rows, 
//     prepareRow 
//   } = tableInstance;

//   return (
//     <div className="project-management-system">
//       <Sidebar />
//       <Topbar />
//       <h1 className="page-title">Project Management System</h1>

//       {/* Buttons for ADD PROJECT and filters */}
//       <div className="actions-container">
//         <button className="add-project-button" onClick={() => setShowAddProjectPopup(true)}>
//           ADD PROJECT
//         </button>
//         <div className="filter-container">
//           <div className="filter-item">
//             <label htmlFor="status-filter" className="filter-label">
//               Filter by Status
//             </label>
//             <select
//               id="status-filter"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="filter-select"
//             >
//               <option value="all">All Statuses</option>
//               <option value="pending">Pending</option>
//               <option value="active">Active</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* ADD PROJECT Popup */}
//       {showAddProjectPopup && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Add New Project</h2>
//             <input
//               type="text"
//               placeholder="Project Title"
//               value={projectTitle}
//               onChange={(e) => setProjectTitle(e.target.value)}
//               className="form-input"
//               required
//             />
//             <textarea
//               placeholder="Project Description"
//               value={projectDescription}
//               onChange={(e) => setProjectDescription(e.target.value)}
//               className="form-textarea"
//             />
//             <div className="form-group">
//               <label>Status:</label>
//               <select
//                 value={projectStatus}
//                 onChange={(e) => setProjectStatus(e.target.value)}
//                 className="form-input"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="active">Active</option>
//                 <option value="completed">Completed</option>
//               </select>
//             </div>
            
//             {/* Start Date with Calendar Icon */}
//             <div className="form-group">
//               <label>Start Date:</label>
//                 <input
//                   type="datetime-local"
//                   id="startDate"
//                   name="startDate"
//                   value={projectStartDate}
//                   onChange={(e) => setProjectStartDate(e.target.value)}
//                   className="form-input"
//                   required
//                   style={{ paddingRight: "40px" }} // Space for the icon
//                 />
//                 <FaCalendarAlt
//                   style={{
//                     position: "absolute",
//                     right: "0px",
//                     top: "50%",
//                     transform: "translateY(-10%)",
//                     cursor: "pointer",
//                     color: "#555",
//                   }}
//                   onClick={() => document.getElementById("startDate").showPicker()} // Open date picker
//                 />
//             </div>
        
//             {/* End Date */}
//             <div className="form-group">
//               <label>End Date (Optional):</label>
//               <input
//                 type="datetime-local"
//                 value={projectEndDate}
//                 min={new Date().toISOString().slice(0, 16)} // Minimum selectable date
//                 onChange={(e) => setProjectEndDate(e.target.value)}
//                 className="form-input"
//               />
//               <FaCalendarAlt
//                   style={{
//                     position: "absolute",
//                     right: "0px",
//                     top: "50%",
//                     transform: "translateY(-10%)",
//                     cursor: "pointer",
//                     color: "#555",
//                   }}
//                   onClick={() => document.getElementById("startDate").showPicker()} // Open date picker
//                 />
//             </div>
        
//             <div className="popup-buttons">
//               <button className="submit-button" onClick={addProject}>
//                 Save Project
//               </button>
//               <button className="cancel-button" onClick={() => setShowAddProjectPopup(false)}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
        
//       )}

//       {/* VIEW PROJECT - Table of Projects */}
//       <div className="table-container">
//         {isLoading ? (
//           <div className="loading-message">Loading projects...</div>
//         ) : error ? (
//           <div className="error-message">{error}</div>
//         ) : projects.length === 0 ? (
//           <div className="no-projects-message">No projects found. Add your first project!</div>
//         ) : (
//           <table {...getTableProps()} className="equipment-table">
//             <thead>
//               {headerGroups.map((headerGroup, idx) => (
//                 <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
//                   {headerGroup.headers.map((column, colIdx) => (
//                     <th {...column.getHeaderProps()} key={colIdx}>{column.render("Header")}</th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//               {rows.map((row, rowIdx) => {
//                 prepareRow(row);
//                 return (
//                   <tr {...row.getRowProps()} key={rowIdx}>
//                     {row.cells.map((cell, cellIdx) => (
//                       <td {...cell.getCellProps()} key={cellIdx}>{cell.render("Cell")}</td>
//                     ))}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Project Details Popup */}
//       {showProjectDetailsPopup && selectedProject && (
//         <div className="modal-overlay">
//           <div className="modal-content project-details-popup">
//             <div className="modal-header">
//               <h2>Project Details</h2>
//               <button className="close-button" onClick={() => setShowProjectDetailsPopup(false)}>
//                 ✕
//               </button>
//             </div>
//             <div className="project-details-grid">
//               <div className="detail-item">
//                 <span className="detail-label">Title:</span>
//                 <span className="detail-value">{selectedProject.title}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Description:</span>
//                 <span className="detail-value">{selectedProject.description || "No description provided"}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Status:</span>
//                 <span className={`detail-value status-badge status-${selectedProject.status || 'pending'}`}>
//                   {selectedProject.status 
//                     ? selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1) 
//                     : 'Pending'}
//                 </span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Start Date:</span>
//                 <span className="detail-value">{formatDate(selectedProject.start_date)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">End Date:</span>
//                 <span className="detail-value">{formatDate(selectedProject.end_date)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Created At:</span>
//                 <span className="detail-value">{formatDate(selectedProject.created_at)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Popup */}
//       {showDeleteConfirmationPopup && (
//         <div className="modal-overlay">
//           <div className="modal-content delete-confirmation-popup">
//             <h2>Delete Project</h2>
//             <p>Are you sure you want to delete this project? This action cannot be undone.</p>
//             <div className="popup-buttons">
//               <button
//                 className="confirm-delete-button"
//                 onClick={async () => {
//                   try {
//                     await axios.delete(`http://localhost:8000/api/projects/${projectToDelete}/`, getAuthConfig());
//                     fetchProjects(); // Refresh the project list
//                   } catch (err) {
//                     console.error("Error deleting project:", err);
//                     alert("Failed to delete project. Please try again.");
//                   } finally {
//                     setShowDeleteConfirmationPopup(false); // Close the popup
//                     setProjectToDelete(null); // Reset the project to delete
//                   }
//                 }}
//               >
//                 Delete
//               </button>
//               <button
//                 className="cancel-delete-button"
//                 onClick={() => {
//                   setShowDeleteConfirmationPopup(false); // Close the popup
//                   setProjectToDelete(null); // Reset the project to delete
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Status Popup */}
//       {showEditStatusPopup && projectToEdit && (
//         <div className="modal-overlay">
//           <div className="modal-content edit-status-popup">
//             <h2>Edit Project Status</h2>
//             <div className="form-group">
//               <label>New Status:</label>
//               <select
//                 value={newStatus}
//                 onChange={(e) => setNewStatus(e.target.value)}
//                 className="form-input"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="active">Active</option>
//                 <option value="completed">Completed</option>
//               </select>
//             </div>
//             <div className="popup-buttons">
//               <button className="submit-button" onClick={updateProjectStatus}>
//                 Update Status
//               </button>
//               <button className="cancel-button" onClick={() => setShowEditStatusPopup(false)}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Project;


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
      const response = await fetch("http://localhost:8000/api/equipment/", {
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
      const response = await fetch("http://localhost:8000/api/bookings/", {
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
      const response = await fetch("http://localhost:8000/api/bookings/", {
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

  }

  return (
    <div className="medtech-lab-container">
      <StudentSidebar />
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