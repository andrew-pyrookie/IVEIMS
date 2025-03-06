// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Select from 'react-select';
// import Sidebar from "/src/components/Admin/Sidebar.jsx";
// import Topbar from "/src/components/Admin/Topbar.jsx";
// import "/src/pages/Admin/styles/Projects.css";

// const ProjectForm = ({ onProjectCreated, onClose }) => {
//   const [users, setUsers] = useState([]);
//   const [equipmentList, setEquipmentList] = useState([]);
//   const [projectData, setProjectData] = useState({
//     title: '',
//     description: '',
//     status: 'pending',
//     lab: null,
//     lab_id: null,
//     members: [],
//     equipment: [],
//     start_date: '',
//     end_date: '',
//     progress: 0
//   });
//   const [errors, setErrors] = useState({});

//   const labOptions = [
//     { id: 1, name: "Design Studio Lab" },
//     { id: 2, name: "MedTech Lab" },
//     { id: 3, name: "Cezeri Lab" },
//   ];

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error('No authentication token found');
//       return;
//     }

//     const config = { headers: { 'Authorization': `Bearer ${token}` } };

//     // Fetch Users
//     axios.get('http://localhost:8000/api/users/', config)
//       .then(response => {
//         const formattedUsers = response.data.map(user => ({
//           value: user.id,
//           label: user.name
//         }));
//         setUsers(formattedUsers);
//       })
//       .catch(error => console.error('Error fetching users:', error));

//     // Fetch Equipment
//     axios.get('http://localhost:8000/api/equipment/', config)
//       .then(response => {
//         const formattedEquipment = response.data.map(equipment => ({
//           value: equipment.id,
//           label: equipment.name
//         }));
//         setEquipmentList(formattedEquipment);
//       })
//       .catch(error => console.error('Error fetching equipment:', error));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProjectData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
//   };

//   const handleLabChange = (e) => {
//     const selectedLabId = parseInt(e.target.value);
//     const selectedLab = labOptions.find(lab => lab.id === selectedLabId);
//     setProjectData(prev => ({
//       ...prev,
//       lab: selectedLab ? selectedLab.name : null,
//       lab_id: selectedLab ? selectedLab.id : null
//     }));
//   };

//   const handleMembersChange = (selectedOptions) => {
//     const selectedUserIds = selectedOptions.map(option => option.value);
//     setProjectData(prev => ({ ...prev, members: selectedUserIds }));
//   };

//   const handleEquipmentChange = (selectedOptions) => {
//     const selectedEquipmentIds = selectedOptions.map(option => option.value);
//     setProjectData(prev => ({ ...prev, equipment: selectedEquipmentIds }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     try {
//       const response = await axios.post(
//         'http://localhost:8000/api/projects/', 
//         projectData, 
//         { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
//       );
//       if (onProjectCreated) onProjectCreated(response.data);
//       onClose(); // Close the modal after submission
//     } catch (error) {
//       console.error('Error creating project:', error.response ? error.response.data : error);
//       alert(`Error: ${error.response?.data?.message || 'Failed to create project'}`);
//     }
//   };

//   return (
//     <div className="modal-content">
//       <div className="modal-header">
//         <h2>Create Project</h2>
//         <button className="close-button" onClick={onClose}>&times;</button>
//       </div>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="title">Project Title</label>
//           <input type="text" id="title" name="title" value={projectData.title} onChange={handleChange} />
//         </div>
//         <div className="form-group">
//           <label htmlFor="lab">Select Lab</label>
//           <select id="lab" name="lab" value={projectData.lab_id || ''} onChange={handleLabChange}>
//             <option value="">Select a lab</option>
//             {labOptions.map(lab => (
//               <option key={lab.id} value={lab.id}>{lab.name}</option>
//             ))}
//           </select>
//         </div>
//         <div className="form-group">
//           <label htmlFor="members">Select Members</label>
//           <Select options={users} isMulti onChange={handleMembersChange} />
//         </div>
//         <div className="form-group">
//           <label htmlFor="equipment">Select Equipment</label>
//           <Select options={equipmentList} isMulti onChange={handleEquipmentChange} />
//         </div>
//         <div className="form-group">
//           <label htmlFor="description">Project Description</label>
//           <textarea id="description" name="description" value={projectData.description} onChange={handleChange} />
//         </div>
//         <div className="form-group">
//           <label htmlFor="start_date">Start Date</label>
//           <input type="date" id="start_date" name="start_date" value={projectData.start_date} onChange={handleChange} />
//         </div>
//         <div className="form-group">
//           <label htmlFor="end_date">End Date</label>
//           <input type="date" id="end_date" name="end_date" value={projectData.end_date} onChange={handleChange} />
//         </div>
//         <div className="form-group">
//           <label htmlFor="progress">Progress (%)</label>
//           <input type="number" id="progress" name="progress" value={projectData.progress} onChange={handleChange} min="0" max="100" />
//         </div>
//         <button type="submit" className="button">Create Project</button>
//       </form>
//     </div>
//   );
// };

// const ProjectsTable = () => {
//   const [projects, setProjects] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error('No authentication token found');
//       return;
//     }

//     const config = { headers: { 'Authorization': `Bearer ${token}` } };
//     axios.get('http://localhost:8000/api/projects/', config)
//       .then(response => setProjects(response.data))
//       .catch(error => console.error('Error fetching projects:', error));
//   }, []);

//   const handleAddProject = () => setShowModal(true);
//   const handleCloseModal = () => setShowModal(false);

//   return (
//     <div className="container">
//       <h1>Projects</h1>
//       <button className="button" onClick={handleAddProject}>Add Project</button>
//       <table className="projects-table">
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Description</th>
//             <th>Status</th>
//             <th>Start Date</th>
//             <th>End Date</th>
//             <th>Progress</th>
//           </tr>
//         </thead>
//         <tbody>
//           {projects.map(project => (
//             <tr key={project.id}>
//               <td>{project.title}</td>
//               <td>{project.description}</td>
//               <td>{project.status}</td>
//               <td>{project.start_date}</td>
//               <td>{project.end_date}</td>
//               <td>{project.progress}%</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {showModal && (
//         <div className="modal open">
//           <ProjectForm onProjectCreated={() => setShowModal(false)} onClose={handleCloseModal} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectsTable;



import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/Projects.css";

const ProjectForm = ({ onProjectSubmitted, onClose, editMode = false, projectData: initialProjectData }) => {
  const [users, setUsers] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [projectData, setProjectData] = useState(
    editMode
      ? {
          ...initialProjectData,
          members: initialProjectData.members || [],
          equipment: initialProjectData.equipment || [],
          lab_id: initialProjectData.lab_id || null, // Ensure lab_id is included
        }
      : {
          title: "",
          description: "",
          status: "pending",
          lab: null,
          lab_id: null,
          members: [],
          equipment: [],
          start_date: "",
          end_date: "",
          progress: 0,
        }
  );
  const [errors, setErrors] = useState({});

  const labOptions = [
    { id: 1, name: "Design Studio Lab" },
    { id: 2, name: "MedTech Lab" },
    { id: 3, name: "Cezeri Lab" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Fetch Users
    axios
      .get("http://localhost:8000/api/users/", config)
      .then((response) => {
        const formattedUsers = response.data.map((user) => ({
          value: user.id,
          label: user.name,
        }));
        setUsers(formattedUsers);
      })
      .catch((error) => console.error("Error fetching users:", error));

    // Fetch Equipment
    axios
      .get("http://localhost:8000/api/equipment/", config)
      .then((response) => {
        const formattedEquipment = response.data.map((equipment) => ({
          value: equipment.id,
          label: equipment.name,
        }));
        setEquipmentList(formattedEquipment);
      })
      .catch((error) => console.error("Error fetching equipment:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleLabChange = (e) => {
    const selectedLabId = parseInt(e.target.value);
    const selectedLab = labOptions.find((lab) => lab.id === selectedLabId);
    setProjectData((prev) => ({
      ...prev,
      lab: selectedLab ? selectedLab.name : null,
      lab_id: selectedLab ? selectedLab.id : null, // Ensure lab_id is set
    }));
  };

  const handleMembersChange = (selectedOptions) => {
    const selectedUserIds = selectedOptions.map((option) => option.value);
    setProjectData((prev) => ({ ...prev, members: selectedUserIds }));
  };

  const handleEquipmentChange = (selectedOptions) => {
    const selectedEquipmentIds = selectedOptions.map((option) => option.value);
    setProjectData((prev) => ({ ...prev, equipment: selectedEquipmentIds }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    // Format dates to match backend requirements
    const formattedProjectData = {
      ...projectData,
      start_date: projectData.start_date ? new Date(projectData.start_date).toISOString() : null,
      end_date: projectData.end_date ? new Date(projectData.end_date).toISOString() : null,
    };
  
    // Log formatted data to verify
    console.log("Formatted Project Data before submission:", formattedProjectData);
  
    try {
      let response;
      
      if (editMode) {
        // Update existing project
        response = await axios.put(
          `http://localhost:8000/api/projects/${projectData.id}/`,
          formattedProjectData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
      } else {
        // Create new project
        response = await axios.post(
          "http://localhost:8000/api/projects/",
          formattedProjectData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
      }
      
      if (onProjectSubmitted) onProjectSubmitted(response.data);
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error(`Error ${editMode ? "updating" : "creating"} project:`, 
        error.response ? error.response.data : error);
      alert(`Error: ${error.response?.data?.message || `Failed to ${editMode ? "update" : "create"} project`}`);
    }
  };

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h2>{editMode ? "Edit Project" : "Create Project"}</h2>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Project Title</label>
          <input type="text" id="title" name="title" value={projectData.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="lab">Select Lab</label>
          <select id="lab" name="lab" value={projectData.lab_id || ""} onChange={handleLabChange}>
            <option value="">Select a lab</option>
            {labOptions.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="members">Select Members</label>
          <Select 
            options={users} 
            isMulti 
            onChange={handleMembersChange}
            value={users.filter(user => projectData.members.includes(user.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="equipment">Select Equipment</label>
          <Select 
            options={equipmentList} 
            isMulti 
            onChange={handleEquipmentChange}
            value={equipmentList.filter(item => projectData.equipment.includes(item.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={projectData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Project Description</label>
          <textarea id="description" name="description" value={projectData.description} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="start_date">Start Date</label>
          <input type="date" id="start_date" name="start_date" value={projectData.start_date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="end_date">End Date</label>
          <input type="date" id="end_date" name="end_date" value={projectData.end_date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="progress">Progress (%)</label>
          <input type="number" id="progress" name="progress" value={projectData.progress} onChange={handleChange} min="0" max="100" />
        </div>
        <button type="submit" className="button">
          {editMode ? "Update Project" : "Create Project"}
        </button>
      </form>
    </div>
  );
};

const DeleteConfirmationModal = ({ project, onConfirm, onCancel }) => {
  return (
    <div className="modal open">
      <div className="modal-content delete-confirm">
        <div className="modal-header">
          <h2>Confirm Delete</h2>
          <button className="close-button" onClick={onCancel}>
            &times;
          </button>
        </div>
        <div className="confirm-message">
          <p>Are you sure you want to delete project: <strong>{project.title}</strong>?</p>
          <p>This action cannot be undone.</p>
        </div>
        <div className="confirm-actions">
          <button className="button cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="button delete-button" onClick={() => onConfirm(project.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectsTable = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProjects = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios
      .get("http://localhost:8000/api/projects/", config)
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Error fetching projects:", error));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = () => {
    setIsEditMode(false);
    setSelectedProject(null);
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setIsEditMode(true);
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDeleteProject = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
  };

  const handleProjectSubmitted = () => {
    fetchProjects();
  };

  const confirmDelete = async (projectId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/api/projects/${projectId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error.response ? error.response.data : error);
      alert(`Error: ${error.response?.data?.message || "Failed to delete project"}`);
    }
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <Sidebar />
      <Topbar />
      <h1>Projects</h1>

      <div className="search-add">
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="search-input"
          />
        </div>
        <button className="button" onClick={handleAddProject}>
          Add Project
        </button>
      </div>
      <table className="projects-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>{project.description}</td>
              <td>{project.status}</td>
              <td>{project.start_date}</td>
              <td>{project.end_date}</td>
              <td>{project.progress}%</td>
              <td className="action-buttons">
                <button className="icon-button edit" onClick={() => handleEditProject(project)}>
                  <FaEdit /> Edit
                </button>
                <button className="icon-button delete" onClick={() => handleDeleteProject(project)}>
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {showModal && (
        <div className="modal open">
          <ProjectForm 
            onProjectSubmitted={handleProjectSubmitted} 
            onClose={handleCloseModal}
            editMode={isEditMode}
            projectData={selectedProject}
          />
        </div>
      )}
      
      {showDeleteModal && (
        <DeleteConfirmationModal
          project={selectedProject}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectsTable;