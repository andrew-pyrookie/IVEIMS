import React, { useState } from "react";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/Reports.css"; // Import the CSS file

const Reports = () => {
  const [activeTab, setActiveTab] = useState("equipment"); // Default tab

  const reportsData = {
    equipment: [
      { id: 1, item: "Projector", user: "John Doe", date: "2025-02-18", action: "Checked Out" },
      { id: 2, item: "Laptop", user: "Alice Smith", date: "2025-02-17", action: "Returned" },
    ],
    booking: [
      { id: 3, item: "Lab Room 101", user: "David Johnson", date: "2025-02-16", action: "Approved" },
      { id: 4, item: "Lab Room 202", user: "Emily White", date: "2025-02-15", action: "Rejected" },
    ],
    activity: [
      { id: 5, user: "Admin", date: "2025-02-14", action: "Updated Inventory" },
      { id: 6, user: "Moderator", date: "2025-02-13", action: "Approved Booking" },
    ],
  };

  const handleExport = (format) => {
    console.log(`Exporting reports as ${format}`);
  };

  return (
    <div className="reports-container">
      <Sidebar />
      <Topbar />
      <div className="reports-main">
        {/* Top Navbar */}
        <div className="top-navbar">
          <h2>📑 System Reports</h2>
        </div>

        {/* Reports Tabs */}
        <div className="reports-tabs">
          <button
            className={activeTab === "equipment" ? "active" : ""}
            onClick={() => setActiveTab("equipment")}
          >
            Equipment Usage Logs
          </button>
          <button
            className={activeTab === "booking" ? "active" : ""}
            onClick={() => setActiveTab("booking")}
          >
            Booking History
          </button>
          <button
            className={activeTab === "activity" ? "active" : ""}
            onClick={() => setActiveTab("activity")}
          >
            User Activity Logs
          </button>
        </div>

        {/* Export Buttons */}
        <div className="export-buttons">
          <button className="export-btn csv" onClick={() => handleExport("CSV")}>
            📄 Export as CSV
          </button>
          <button className="export-btn pdf" onClick={() => handleExport("PDF")}>
            🖨️ Export as PDF
          </button>
        </div>

        {/* Reports Table */}
        <div className="reports-content">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item / User</th>
                <th>User</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reportsData[activeTab].map((report, index) => (
                <tr key={report.id}>
                  <td>{index + 1}</td>
                  <td>{report.item || report.user}</td>
                  <td>{report.user}</td>
                  <td>{report.date}</td>
                  <td>{report.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
