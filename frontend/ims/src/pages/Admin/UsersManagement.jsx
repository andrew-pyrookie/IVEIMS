import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import {FaUser } from "react-icons/fa";
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/UserManagement.css"; // Import the CSS file

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false); // State for modal visibility
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
    confirmPassword: '',
  });
  const [submitError, setSubmitError] = useState(''); // Error message for form submission

  useEffect(() => {
    // Fetch user data from your API
    fetch('http://localhost:8000/api/users/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data); // Set the fetched users data
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input changes in the add user form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  // Handle form submission
  const handleAddUser = async (e) => {
    e.preventDefault();

    // Validate password match
    if (newUser.password !== newUser.confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }

    // Prepare the user data to send to the API
    const userData = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      password: newUser.password,
    };

    try {
      const response = await fetch('http://localhost:8000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to add user.');
      }

      const data = await response.json();
      setUsers([...users, data]); // Add the new user to the list
      setShowAddModal(false); // Close the modal
      setNewUser({
        name: '',
        email: '',
        role: 'student',
        password: '',
        confirmPassword: '',
      });
      setSubmitError('');
    } catch (error) {
      setSubmitError('Failed to add user. Please try again.');
      console.error('Error adding user:', error);
    }
  };

  // Define the columns of the table
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Role',
        accessor: 'role',
        Cell: ({ value }) => (
          <span className={`role-badge role-${value.toLowerCase()}`}>
            {value}
          </span>
        ),
      },
    ],
    []
  );

  // Use the table hook from React Table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: filteredUsers, // Pass the filtered users
  });

  return (
    <div className="user-table-container">
      <Sidebar />
      <Topbar />
      <h2 className="table-title">User List</h2>
      
      {/* Search Bar and Add User Button */}
      <div className="actions-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by Email"
          className="search-bar"
        />
        <button className="add-user-button" onClick={() => setShowAddModal(true)}>
          Add User
        </button>
      </div>

      {/* Table Wrapper for horizontal scrolling */}
      <div className="table-wrapper">
        <table {...getTableProps()} className="users-table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} key={cell.row.id + cell.column.id}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add New User</h2>
              <button
                className="close-button"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddUser} className="add-user-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="lab manager">Lab Manager</option>
                  <option value="lab technician">Lab Technician</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={newUser.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {submitError && <div className="error-message">{submitError}</div>}
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;