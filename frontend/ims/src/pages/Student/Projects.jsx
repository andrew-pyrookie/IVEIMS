// import React, { useState, useEffect } from "react";
// import '/src/pages/Student/styles/Projects.css';
// import Sidebar from "/src/components/Student/StudentSidebar.jsx";
// import Topbar from "/src/components/Student/StudentTopbar.jsx";
// import { useTable } from "react-table";
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
//       <div className="action-buttons">
//         <button className="add-project-button" onClick={() => setShowAddProjectPopup(true)}>
//           ADD PROJECT
//         </button>
//         <div className="filters">
//           <select 
//             className="filter-select"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="all">All Statuses</option>
//             <option value="pending">Pending</option>
//             <option value="active">Active</option>
//             <option value="completed">Completed</option>
//           </select>
//         </div>
//       </div>

//       {/* ADD PROJECT Popup */}
//       {showAddProjectPopup && (
//         <div className="popup-overlay">
//           <div className="popup-content">
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
//             <div className="form-group">
//               <label>Start Date:</label>
//               <input
//                 type="datetime-local"
//                 value={projectStartDate}
//                 onChange={(e) => setProjectStartDate(e.target.value)}
//                 className="form-input"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>End Date (Optional):</label>
//               <input
//                 type="datetime-local"
//                 value={projectEndDate}
//                 onChange={(e) => setProjectEndDate(e.target.value)}
//                 className="form-input"
//               />
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
//       <div className="projects-table-container">
//         <h2>Projects</h2>
//         {isLoading ? (
//           <div className="loading-message">Loading projects...</div>
//         ) : error ? (
//           <div className="error-message">{error}</div>
//         ) : projects.length === 0 ? (
//           <div className="no-projects-message">No projects found. Add your first project!</div>
//         ) : (
//           <table {...getTableProps()} className="projects-table">
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
//         <div className="popup-overlay">
//           <div className="popup-content project-details-popup">
//             <div className="popup-header">
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
//         <div className="popup-overlay">
//           <div className="popup-content delete-confirmation-popup">
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
//     </div>
//   );
// };

// export default Project;







import React, { useState, useEffect } from "react";
import '/src/pages/Student/styles/Projects.css';
import Sidebar from "/src/components/Student/StudentSidebar.jsx";
import Topbar from "/src/components/Student/StudentTopbar.jsx";
import { useTable } from "react-table";
import axios from "axios"; // Make sure to install axios: npm install axios

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [showAddProjectPopup, setShowAddProjectPopup] = useState(false);
  const [showProjectDetailsPopup, setShowProjectDetailsPopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirmationPopup, setShowDeleteConfirmationPopup] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null); // Store the project ID to delete

  // Form state for adding a new project
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [projectStatus, setProjectStatus] = useState("pending");

  // Configuration for API requests with auth token
  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // Fetch projects from the backend
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/projects/', getAuthConfig());
      // Ensure projects is always an array
      setProjects(Array.isArray(response.data) ? response.data : []);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
      setProjects([]); // Ensure projects is reset to an empty array on error
      setIsLoading(false);
    }
  };

  // Add a new project
  const addProject = async () => {
    if (projectTitle && projectStartDate) {
      try {
        const projectData = {
          title: projectTitle,
          description: projectDescription,
          start_date: projectStartDate,
          end_date: projectEndDate || null,
          status: projectStatus
        };

        await axios.post('http://localhost:8000/api/projects/', projectData, getAuthConfig());
        fetchProjects(); // Refresh the project list
        setShowAddProjectPopup(false); // Close the popup
        resetForm(); // Reset the form fields
      } catch (err) {
        console.error("Error adding project:", err);
        alert("Failed to add project. Please try again.");
      }
    } else {
      alert("Project title and start date are required.");
    }
  };

  // Delete a project
  const deleteProject = (projectId) => {
    setProjectToDelete(projectId); // Set the project ID to delete
    setShowDeleteConfirmationPopup(true); // Show the delete confirmation popup
  };

  // Reset the form fields
  const resetForm = () => {
    setProjectTitle("");
    setProjectDescription("");
    setProjectStartDate("");
    setProjectEndDate("");
    setProjectStatus("pending");
  };

  // Open project details popup
  const openProjectDetails = (project) => {
    setSelectedProject(project);
    setShowProjectDetailsPopup(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Define columns for the table
  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Title", accessor: "title" },
      { 
        Header: "Start Date", 
        accessor: "start_date",
        Cell: ({ value }) => formatDate(value)
      },
      { 
        Header: "End Date", 
        accessor: "end_date",
        Cell: ({ value }) => formatDate(value)
      },
      { 
        Header: "Status", 
        accessor: "status",
        Cell: ({ value }) => (
          <span className={`status-badge status-${value?.toLowerCase() || 'pending'}`}>
            {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Pending'}
          </span>
        )
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="actions">
            <button
              className="view-details-button"
              onClick={() => openProjectDetails(row.original)}
            >
              View Details
            </button>
            <button
              className="delete-button"
              onClick={() => deleteProject(row.original.id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Handle filter change
  const [statusFilter, setStatusFilter] = useState("all");
  
  const filteredProjects = React.useMemo(() => {
    // Ensure projects is an array
    if (!Array.isArray(projects)) return [];
    
    if (statusFilter === "all") return projects;
    return projects.filter(project => project.status === statusFilter);
  }, [projects, statusFilter]);

  // Use React Table with safeguard for data
  const tableData = React.useMemo(() => 
    Array.isArray(filteredProjects) ? filteredProjects : [], 
    [filteredProjects]
  );
  
  const tableInstance = useTable({ 
    columns, 
    data: tableData
  });
  
  const { 
    getTableProps, 
    getTableBodyProps, 
    headerGroups, 
    rows, 
    prepareRow 
  } = tableInstance;

  return (
    <div className="project-management-system">
      <Sidebar />
      <Topbar />
      <h1 className="page-title">Project Management System</h1>

      {/* Buttons for ADD PROJECT and filters */}
      <div className="actions-container">
        <button className="add-project-button" onClick={() => setShowAddProjectPopup(true)}>
          ADD PROJECT
        </button>
        <div className="filter-container">
          <div className="filter-item">
            <label htmlFor="status-filter" className="filter-label">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* ADD PROJECT Popup */}
      {showAddProjectPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Project</h2>
            <input
              type="text"
              placeholder="Project Title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="form-input"
              required
            />
            <textarea
              placeholder="Project Description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="form-textarea"
            />
            <div className="form-group">
              <label>Status:</label>
              <select
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
                className="form-input"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Start Date:</label>
              <input
                type="datetime-local"
                value={projectStartDate}
                onChange={(e) => setProjectStartDate(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>End Date (Optional):</label>
              <input
                type="datetime-local"
                value={projectEndDate}
                onChange={(e) => setProjectEndDate(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="popup-buttons">
              <button className="submit-button" onClick={addProject}>
                Save Project
              </button>
              <button className="cancel-button" onClick={() => setShowAddProjectPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PROJECT - Table of Projects */}
      <div className="table-container">
        {isLoading ? (
          <div className="loading-message">Loading projects...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : projects.length === 0 ? (
          <div className="no-projects-message">No projects found. Add your first project!</div>
        ) : (
          <table {...getTableProps()} className="equipment-table">
            <thead>
              {headerGroups.map((headerGroup, idx) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                  {headerGroup.headers.map((column, colIdx) => (
                    <th {...column.getHeaderProps()} key={colIdx}>{column.render("Header")}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, rowIdx) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={rowIdx}>
                    {row.cells.map((cell, cellIdx) => (
                      <td {...cell.getCellProps()} key={cellIdx}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Project Details Popup */}
      {showProjectDetailsPopup && selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content project-details-popup">
            <div className="modal-header">
              <h2>Project Details</h2>
              <button className="close-button" onClick={() => setShowProjectDetailsPopup(false)}>
                ✕
              </button>
            </div>
            <div className="project-details-grid">
              <div className="detail-item">
                <span className="detail-label">Title:</span>
                <span className="detail-value">{selectedProject.title}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{selectedProject.description || "No description provided"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className={`detail-value status-badge status-${selectedProject.status || 'pending'}`}>
                  {selectedProject.status 
                    ? selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1) 
                    : 'Pending'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Start Date:</span>
                <span className="detail-value">{formatDate(selectedProject.start_date)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">End Date:</span>
                <span className="detail-value">{formatDate(selectedProject.end_date)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created At:</span>
                <span className="detail-value">{formatDate(selectedProject.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirmationPopup && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirmation-popup">
            <h2>Delete Project</h2>
            <p>Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="popup-buttons">
              <button
                className="confirm-delete-button"
                onClick={async () => {
                  try {
                    await axios.delete(`http://localhost:8000/api/projects/${projectToDelete}/`, getAuthConfig());
                    fetchProjects(); // Refresh the project list
                  } catch (err) {
                    console.error("Error deleting project:", err);
                    alert("Failed to delete project. Please try again.");
                  } finally {
                    setShowDeleteConfirmationPopup(false); // Close the popup
                    setProjectToDelete(null); // Reset the project to delete
                  }
                }}
              >
                Delete
              </button>
              <button
                className="cancel-delete-button"
                onClick={() => {
                  setShowDeleteConfirmationPopup(false); // Close the popup
                  setProjectToDelete(null); // Reset the project to delete
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;