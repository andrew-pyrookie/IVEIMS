import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Use NavLink instead of Link
import "./Sidebar.css"; // Import styles
import { FaChartBar, FaUsers, FaBox, FaCalendarAlt, FaFileAlt, FaDatabase, FaBars, FaUser, FaTimes,FaChevronDown,FaChevronRight,FaTools,FaFlask,FaMedkit
} from "react-icons/fa"; // Import icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar is hidden by default on small screens
  const [inventoryOpen, setInventoryOpen] = useState(false); // State for inventory dropdown

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
          <h1>labMan Dashboard</h1>
        </div>
        <ul>
          <li>
            <NavLink
              to="/labmanager/dashboard"
              activeClassName="active" // Apply active class
              exact // Ensure exact match for the root path
            >
              <FaChartBar className="icon" />
              <span className="text">Dashboard</span>
            </NavLink>
          </li>
          <li className={inventoryOpen ? "submenu-open" : ""}>
            <a href="#" onClick={toggleInventory} className="dropdown-link">
              <FaBox className="icon" />
              <span className="text">Inventory</span>
              <span className="dropdown-icon">
                {inventoryOpen ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            </a>
            <ul className={`submenu ${inventoryOpen ? "open" : ""}`}>
              <li>
                <NavLink
                  to="/labmanager/designstudiolab"
                  activeClassName="active"
                >
                  <FaTools className="submenu-icon" />
                  <span className="text">Design Studio</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/lamanager/cezerilab"
                  activeClassName="active"
                >
                  <FaFlask className="submenu-icon" />
                  <span className="text">Cezeri Lab</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/labmanager/medtechlab"
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
              to="/labmanager/bookings"
              activeClassName="active" // Apply active class
            >
              <FaCalendarAlt className="icon" />
              <span className="text">Bookings</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="lLabmanager/SharedResourses"
              activeClassName="active" // Apply active class
            >
              <FaFileAlt className="icon" />
              <span className="text">Shared Equipment</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/labmanager/Reports"
              activeClassName="active" // Apply active class
            >
              <FaDatabase className="icon" />
              <span className="text">Reports</span>
            </NavLink>
            <li>
            <NavLink
              to="/labmanager/Projects"
              activeClassName="active" // Apply active class
            >
              <FaDatabase className="icon" />
              <span className="text">Projects</span>
            </NavLink>
          </li>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;