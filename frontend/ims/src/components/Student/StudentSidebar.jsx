import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Use NavLink instead of Link
import "./Sidebar.css"; // Import styles
import { FaChartBar, FaProjectDiagram, FaCalendarAlt, FaUser, FaTimes,FaBox,FaTools,FaFlask,FaMedkit,FaChevronRight,FaChevronDown } from "react-icons/fa"; // Import icons
import { MdWork } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import Kulogo from "/src/assets/kulogo.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar is hidden by default
    const [inventoryOpen, setInventoryOpen] = useState(false); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle sidebar visibility
  };

  const toggleInventory = (e) => {
    e.preventDefault(); // Prevent navigation
    setInventoryOpen(!inventoryOpen); // Toggle inventory dropdown
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
          <img src={Kulogo} alt="Logo" className="sidebar-logo" />
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
            <li className={inventoryOpen ? "submenu-open" : ""}>
              <a href="#" onClick={toggleInventory} className="dropdown-link">
                <FaBox className="icon" />
                <span className="text">Bookings</span>
                <span className="dropdown-icon">
                  {inventoryOpen ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              </a>
              <ul className={`submenu ${inventoryOpen ? "open" : ""}`}>
                <li>
                  <NavLink
                    to="/student/designstudiolab"
                    activeClassName="active"
                  >
                    <FaTools className="submenu-icon" />
                    <span className="text">Design Studio</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/student/cezerilab"
                    activeClassName="active"
                  >
                    <FaFlask className="submenu-icon" />
                    <span className="text">Cezeri Lab</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/student/medtechlab"
                    activeClassName="active"
                  >
                    <FaMedkit className="submenu-icon" />
                    <span className="text">MedTech Lab</span>
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
            <NavLink
              to="/student/scanning"
              className={({ isActive }) => 
                `${isActive ? 'active' : ''}`
              }
            >
              <FaUser className="icon" />
              <span className="text">Scan QR code</span>
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