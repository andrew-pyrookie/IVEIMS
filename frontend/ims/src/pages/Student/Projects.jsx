import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaFileDownload, FaFilePdf, FaFileWord } from "react-icons/fa"; 
import Sidebar from "/src/components/Student/StudentSidebar.jsx";
import Topbar from "/src/components/Student/StudentTopbar.jsx";
import "/src/pages/Student/styles/Projects.css";

const StudentDashboard = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState({
    name: "",
    description: "",
    files: [], // Default to an empty array
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/api/projects/${projectId}`);
        console.log("API Response:", response.data); // Debugging
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch project details.");
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Handle file download
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await axios.get(fileUrl, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download file:", err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return <div className="error">Project not found.</div>;

  return (
    <div className="student-dashboard">
      <Topbar/>
      <div className="dashboard-header">
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </div>

      <div className="files-section">
        <h2>
          <FaFileDownload /> Files
        </h2>
        {project.files && project.files.length > 0 ? (
          <ul className="file-list">
            {project.files.map((file) => (
              <li key={file.id} className="file-item">
                <div className="file-info">
                  {file.name.endsWith(".pdf") ? (
                    <FaFilePdf className="file-icon" />
                  ) : (
                    <FaFileWord className="file-icon" />
                  )}
                  <span className="file-name">{file.name}</span>
                </div>
                <button
                  onClick={() => handleDownload(file.url, file.name)}
                  className="download-button"
                >
                  <FaFileDownload /> Download
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-files">No files available for this project.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;