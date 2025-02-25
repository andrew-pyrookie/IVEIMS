import { useState, useEffect } from "react";
import { Table, Loader, Center, Text, Paper } from "@mantine/core";
import axios from "axios";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import "/src/pages/Admin/styles/UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }
    console.log("Sending request with token:", token);

    // Make the API request with the token
    axios.get("http://localhost:8000/api/users/", {
      headers: {
        "Authorization": `Bearer ${token}`, 
      }
    })
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch users or unauthorized access.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Center className="loader-container">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center className="error-container">
        <Text className="error-text">{error}</Text>
      </Center>
    );
  }

  return (
    <div className="user-container">
      <Sidebar /> 
      <Paper padding="md" shadow="xs" className="table-container">
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-users">No users found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Paper>
    </div>
  );
};

export default UserManagement;
