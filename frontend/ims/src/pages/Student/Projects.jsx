// Project.jsx
import React from 'react';
import '/src/pages/Student/styles/Projects.css';
import Sidebar from "/src/components/Student/Sidebar.jsx";
const Project = () => {
  return (
    <div className="project-container">
      <Sidebar />
      <div className="main-content">
        <div className="top-navbar">
          <span className="navbar-title">📂 Project Management</span>
        </div>
        <div className="content-section">
          <div className="projects-list">
            <h2>List of Projects</h2>
            <div className="project-card">
              <h3>Project 1</h3>
              <p>Status: In Progress</p>
            </div>
            <div className="project-card">
              <h3>Project 2</h3>
              <p>Status: Completed</p>
            </div>
            <div className="project-card">
              <h3>Project 3</h3>
              <p>Status: Pending</p>
            </div>
          </div>
          <div className="documentation-section">
            <h2>Add/Edit Documentation</h2>
            <textarea placeholder="Add project documentation here..." />
          </div>
          <div className="status-section">
            <h2>Project Status</h2>
            <div className="status-card">Status: In Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
