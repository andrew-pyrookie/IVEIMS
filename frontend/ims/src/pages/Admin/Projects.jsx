import React, { useEffect, useState, useCallback } from "react";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { FaEdit, FaTrash, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    projectTitle: "",
    labType: "",
    projectDescription: "",
    status: "Pending",
    startDate: "",
    endDate: "",
    projectFiles: [],
    students: [],
  });

  const statusOptions = ["Active", "Pending", "Completed"];
  const labOptions = ["MedTech Lab", "Design Studio Lab", "Cezari Lab"];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/projects/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects data");
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      projectFiles: files,
    });
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email && !formData.students.includes(email)) {
      setFormData({
        ...formData,
        students: [...formData.students, email],
      });
      e.target.email.value = ""; // Clear the input field
    }
  };

  const handleRemoveStudent = (email) => {
    setFormData({
      ...formData,
      students: formData.students.filter((student) => student !== email),
    });
  };

  const handleEditClick = (project) => {
    setFormData({
      projectTitle: project.projectTitle,
      labType: project.labType,
      projectDescription: project.projectDescription,
      status: project.status,
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      projectFiles: project.projectFiles || [],
      students: project.students || [],
    });
    setCurrentProject(project);
    setShowEditModal(true);
  };

  const handleDeleteClick = (project) => {
    setCurrentProject(project);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      projectTitle: "",
      labType: "",
      projectDescription: "",
      status: "Pending",
      startDate: "",
      endDate: "",
      projectFiles: [],
      students: [],
    });
    setSubmitError("");
  };

  const handleAddProject = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add project");
      }

      const newProject = await response.json();
      setProjects([...projects, newProject]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      setSubmitError("Failed to add project. Please try again.");
      console.error("Error adding project:", error);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    try {
      const updatedFields = {};
      for (const key in formData) {
        if (formData[key] !== currentProject[key]) {
          updatedFields[key] = formData[key];
        }
      }

      if (Object.keys(updatedFields).length === 0) {
        setSubmitError("No fields were updated.");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/projects/${currentProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      const updatedProject = await response.json();
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === currentProject.id ? { ...project, ...updatedFields } : project
        )
      );
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      setSubmitError("Failed to update project. Please try again.");
      console.error("Error updating project:", error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${currentProject.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects(projects.filter((project) => project.id !== currentProject.id));
      setShowDeleteConfirm(false);
      setCurrentProject(null);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Sanitize projects data to ensure students is always an array
  const sanitizedProjects = React.useMemo(() => {
    return projects.map((project) => ({
      ...project,
      students: project.students || [],
    }));
  }, [projects]);

  // Define the columns for the table
  const columns = React.useMemo(
    () => [
      {
        Header: "Project Title",
        accessor: "projectTitle",
      },
      {
        Header: "Lab Type",
        accessor: "labType",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span className={`status-badge status-${value.toLowerCase()}`}>
            {value}
          </span>
        ),
      },
      {
        Header: "Start Date",
        accessor: "startDate",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "End Date",
        accessor: "endDate",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Students",
        accessor: "students",
        Cell: ({ value }) => (
          <div className="students-list">
            {(value || []).map((student, index) => (
              <span key={index} className="student-email">
                {student}
              </span>
            ))}
          </div>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button
              className="action-button edit-button"
              onClick={() => handleEditClick(row.original)}
              title="Edit Project"
            >
              <FaEdit />
            </button>
            <button
              className="action-button delete-button"
              onClick={() => handleDeleteClick(row.original)}
              title="Delete Project"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    []
  );

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
      data: sanitizedProjects,
      initialState: React.useMemo(() => ({ pageIndex: 0, pageSize: 10 }), []),
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  const handleSearch = useCallback(() => {
    setGlobalFilter(searchTerm);
  }, [searchTerm, setGlobalFilter]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  if (isLoading) {
    return (
      <div className="projects-container">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading projects data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />

        <div className="content-header">
          <h1>Projects Management</h1>
          <p>Manage all lab-specific projects</p>
        </div>

        <div className="actions-container">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="search-input"
            />
          </div>
          <button className="add-button" onClick={() => setShowAddModal(true)}>
            Add New Project
          </button>
        </div>

        <div className="table-container">
          <table {...getTableProps()} className="projects-table">
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
                    No projects found. Add some projects to get started.
                  </td>
                </tr>
              ) : (
                page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr key={row.id} {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td key={cell.column.id} {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
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
            Showing {page.length} of {projects.length} results
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

        {/* Add Project Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Add New Project</h2>
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
              <form onSubmit={handleAddProject} className="project-form">
                <div className="form-group">
                  <label htmlFor="projectTitle">Project Title</label>
                  <input
                    type="text"
                    id="projectTitle"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="labType">Lab Type</label>
                  <select
                    id="labType"
                    name="labType"
                    value={formData.labType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a lab</option>
                    {labOptions.map((lab) => (
                      <option key={lab} value={lab}>
                        {lab}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="projectDescription">Project Description</label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
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
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group half">
                    <label htmlFor="projectFiles">Project Files</label>
                    <input
                      type="file"
                      id="projectFiles"
                      name="projectFiles"
                      onChange={handleFileChange}
                      multiple
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="students">Add Students</label>
                  <form onSubmit={handleAddStudent} className="add-student-form">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter student email"
                      required
                    />
                    <button type="submit" className="add-student-button">
                      Add Student
                    </button>
                  </form>
                  <div className="students-list">
                    {formData.students.map((student, index) => (
                      <div key={index} className="student-email">
                        {student}
                        <button
                          type="button"
                          className="remove-student-button"
                          onClick={() => handleRemoveStudent(student)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
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
                    Add Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {showEditModal && currentProject && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Edit Project</h2>
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
              <form onSubmit={handleUpdateProject} className="project-form">
                <div className="form-group">
                  <label htmlFor="edit-projectTitle">Project Title</label>
                  <input
                    type="text"
                    id="edit-projectTitle"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-labType">Lab Type</label>
                  <select
                    id="edit-labType"
                    name="labType"
                    value={formData.labType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a lab</option>
                    {labOptions.map((lab) => (
                      <option key={lab} value={lab}>
                        {lab}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-projectDescription">Project Description</label>
                  <textarea
                    id="edit-projectDescription"
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
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
                    <label htmlFor="edit-startDate">Start Date</label>
                    <input
                      type="date"
                      id="edit-startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="edit-endDate">End Date</label>
                    <input
                      type="date"
                      id="edit-endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group half">
                    <label htmlFor="edit-projectFiles">Project Files</label>
                    <input
                      type="file"
                      id="edit-projectFiles"
                      name="projectFiles"
                      onChange={handleFileChange}
                      multiple
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-students">Add Students</label>
                  <form onSubmit={handleAddStudent} className="add-student-form">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter student email"
                      required
                    />
                    <button type="submit" className="add-student-button">
                      Add Student
                    </button>
                  </form>
                  <div className="students-list">
                    {formData.students.map((student, index) => (
                      <div key={index} className="student-email">
                        {student}
                        <button
                          type="button"
                          className="remove-student-button"
                          onClick={() => handleRemoveStudent(student)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
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
                    Update Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && currentProject && (
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
                  Are you sure you want to delete <strong>{currentProject.projectTitle}</strong>?
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
                  onClick={handleDeleteProject}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;