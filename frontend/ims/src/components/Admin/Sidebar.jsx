import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Import styles
import { FaChartBar, FaUsers, FaBox, FaCalendarAlt, FaFileAlt, FaDatabase, FaBars } from "react-icons/fa"; // Import icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar is hidden by default on small screens

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle sidebar visibility
  };

  return (
    <>
      {/* Hamburger icon visible on small screens */}
      <FaBars className="hamburger-icon" onClick={toggleSidebar} />
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h1>Admin Dashboard</h1>
        </div>
        <ul>
          <li>
            <Link to="/admin/dashboard">
              <FaChartBar className="icon" />
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/users">
              <FaUsers className="icon" />
              <span className="text">Users Mgmt</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/inventory">
              <FaBox className="icon" />
              <span className="text">Inventory</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/bookings">
              <FaCalendarAlt className="icon" />
              <span className="text">Bookings</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/reports">
              <FaFileAlt className="icon" />
              <span className="text">Reports</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/backup">
              <FaDatabase className="icon" />
              <span className="text">Backup</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
