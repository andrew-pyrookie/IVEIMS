
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/Backup.css";


const BackupLogs = () => {
  const [backupLogs, setBackupLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // State for success/error messages

  // Fetch the token from local storage
  const authToken = localStorage.getItem("token");

  // Fetch backup logs from the Django API
  useEffect(() => {
    const fetchBackupLogs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/admin/backup-logs/", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the token in the request headers
          },
        });
        setBackupLogs(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBackupLogs();
  }, [authToken]); // Re-fetch if the token changes

  // Function to sync offline data
  const syncOfflineData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/sync-offline-data/",
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setMessage({ type: "success", text: response.data.message }); // Set success message
    } catch (err) {
      setMessage({ type: "error", text: "Failed to sync offline data. Please check the server." }); // Set error message
    } finally {
      // Clear the message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>Loading backup logs...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", color: "red" }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }} className="backup-container">
      <Sidebar/>
      <Topbar/>
      {/* Message Banner */}
      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
            color: message.type === "success" ? "#155724" : "#721c24",
            border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          {message.text}
        </div>
      )}

      <button
        onClick={syncOfflineData}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Sync Offline Data
      </button>
      <h1 style={{ color: "#333", marginBottom: "20px" }}>Backup Logs</h1>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#007bff", color: "white" }}>
            <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
            <th style={{ padding: "12px", textAlign: "left" }}>File Path</th>
          </tr>
        </thead>
        <tbody>
          {backupLogs.map((log) => (
            <tr
              key={log.id}
              style={{
                backgroundColor: "#f9f9f9",
                borderBottom: "1px solid #ddd",
                transition: "background-color 0.3s",
              }}
            >
              <td style={{ padding: "12px", textAlign: "left" }}>{log.id}</td>
              <td style={{ padding: "12px", textAlign: "left" }}>
                {new Date(log.date).toLocaleString()}
              </td>
              <td style={{ padding: "12px", textAlign: "left" }}>{log.status}</td>
              <td style={{ padding: "12px", textAlign: "left" }}>{log.file_path}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackupLogs;
