import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Import styles
import { FaChartBar, FaProjectDiagram, FaCalendarAlt, FaUser, FaTimes  } from "react-icons/fa"; // Import icons
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
            <Link to="/student/dashboard">
              <FaChartBar className="icon" />
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/student/projects">
              <FaProjectDiagram className="icon" />
              <span className="text">Projects</span>
            </Link>
          </li>
          <li>
            <Link to="/student/documents">
              <MdWork className="icon" />
              <span className="text">Documents</span>
            </Link>
          </li>
          <li>
            <Link to="/student/bookings">
              <FaCalendarAlt className="icon" />
              <span className="text">Bookings</span>
            </Link>
          </li>
          <li>
            <Link to="/student/profile">
              <FaUser className="icon" />
              <span className="text">Profile</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
