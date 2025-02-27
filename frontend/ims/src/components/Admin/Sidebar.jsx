import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Use NavLink instead of Link
import "./Sidebar.css"; // Import styles
import { FaChartBar, FaUsers, FaBox, FaCalendarAlt, FaFileAlt, FaDatabase, FaBars, FaUser, FaTimes } from "react-icons/fa"; // Import icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar is hidden by default on small screens

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
          <h1>Admin Dashboard</h1>
        </div>
        <ul>
          <li>
            <NavLink
              to="/admin/dashboard"
              activeClassName="active" // Apply active class
              exact // Ensure exact match for the root path
            >
              <FaChartBar className="icon" />
              <span className="text">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              activeClassName="active" // Apply active class
            >
              <FaUsers className="icon" />
              <span className="text">Users Mgmt</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/inventory"
              activeClassName="active" // Apply active class
            >
              <FaBox className="icon" />
              <span className="text">Inventory</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/bookings"
              activeClassName="active" // Apply active class
            >
              <FaCalendarAlt className="icon" />
              <span className="text">Bookings</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reports"
              activeClassName="active" // Apply active class
            >
              <FaFileAlt className="icon" />
              <span className="text">Reports</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/backup"
              activeClassName="active" // Apply active class
            >
              <FaDatabase className="icon" />
              <span className="text">Backup</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/profile"
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