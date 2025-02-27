import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Use NavLink instead of Link
import "./Sidebar.css"; // Import styles
import { FaChartBar, FaProjectDiagram, FaCalendarAlt, FaUser, FaTimes } from "react-icons/fa"; // Import icons
import { MdWork } from "react-icons/md";
import { FaBars } from "react-icons/fa"; // Import Hamburger icon

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar is hidden by default

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle sidebar visibility
  };

  return (
    <>
      {/* Hamburger icon visible on small screens */}
      <div className="hamburger-icon" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h1>Student Dashboard</h1>
        </div>
        <ul>
          <li>
            <NavLink
              to="/student/dashboard"
              activeClassName="active" // Apply active class
              exact // Ensure exact match for the root path
            >
              <FaChartBar className="icon" />
              <span className="text">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/projects"
              activeClassName="active" // Apply active class
            >
              <FaProjectDiagram className="icon" />
              <span className="text">Projects</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/documents"
              activeClassName="active" // Apply active class
            >
              <MdWork className="icon" />
              <span className="text">Documents</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/bookings"
              activeClassName="active" // Apply active class
            >
              <FaCalendarAlt className="icon" />
              <span className="text">Bookings</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/profile"
              activeClassName="active" // Apply active class
            >
              <FaUser className="icon" />
              <span className="text">Profile</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;