// Documents.jsx
import React, { useState } from 'react';
import Sidebar from "/src/components/Student/StudentSidebar.jsx";
import Topbar from "/src/components/Student/StudentTopbar.jsx";
import '/src/pages/Student/styles/Documents.css';

const Documents = () => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles([...files, ...uploadedFiles]);
  };

  return (
    <div className="documents-container">
      <Sidebar />
      <Topbar />
      <div className="main-content">
        <div className="top-navbar">
          <span className="navbar-title">📜 Documentation</span>
        </div>

        <div className="doc-grid">
          {/* Upload Section */}
          <div className="card upload-section">
            <h3>Upload Project Files</h3>
            <input type="file" multiple onChange={handleFileUpload} className="upload-input"/>
          </div>

          {/* View Reports Section */}
          <div className="card view-reports">
            <h3>View Reports</h3>
            {files.length > 0 ? (
              <ul className="file-list">
                {files.map((file, index) => (
                  <li key={index} className="file-item">{file.name}</li>
                ))}
              </ul>
            ) : (
              <p>No files uploaded yet.</p>
            )}
          </div>

          {/* Download Resources Section */}
          <div className="card download-resources">
            <h3>Download Resources</h3>
            <button className="download-btn">Download Sample Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
