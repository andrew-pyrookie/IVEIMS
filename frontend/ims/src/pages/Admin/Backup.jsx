import React from "react";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import { FaDatabase, FaSync, FaShieldAlt, FaLock, FaClipboardList } from "react-icons/fa";
import "/src/pages/Admin/styles/Backup.css";

const Backup = () => {
  return (
    <div className="backup-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <h2>🔒 Backup & Security</h2>
        <p>Manage system backups, restore data, and enhance security through encryption settings.</p>

        {/* Backup Options Grid */}
        <div className="backup-grid">
          <div className="backup-card">
            <FaSync className="backup-icon auto-backup" />
            <h3>Automated Backups</h3>
            <p>Schedule automatic data backups to ensure security and recovery.</p>
            <button className="backup-btn">Configure</button>
          </div>

          <div className="backup-card">
            <FaDatabase className="backup-icon recovery" />
            <h3>Data Recovery</h3>
            <p>Restore lost or corrupted data from previous backups.</p>
            <button className="backup-btn">Restore</button>
          </div>

          <div className="backup-card">
            <FaShieldAlt className="backup-icon encryption" />
            <h3>Encryption Settings</h3>
            <p>Manage data encryption to enhance system security.</p>
            <button className="backup-btn">Manage</button>
          </div>

          <div className="backup-card">
            <FaClipboardList className="backup-icon logs" />
            <h3>System Logs</h3>
            <p>View detailed logs of backup operations and security events.</p>
            <button className="backup-btn">View Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backup;
