
import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import { FaUser, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/UserManagement.css";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [changePassword, setChangePassword] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
    confirmPassword: '',
  });
  const [editUser, setEditUser] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/users/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({
      ...editUser,
      [name]: value,
    });
  };

  const toggleChangePassword = () => {
    setChangePassword(!changePassword);
    if (!changePassword) {
      setEditUser({
        ...editUser,
        password: '',
        confirmPassword: ''
      });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (newUser.password !== newUser.confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }

    const userData = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      password: newUser.password,
      confirmPassword: newUser.confirmPassword,
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

      if (!response.ok) throw new Error('Failed to add user.');

      const data = await response.json();
      setUsers([...users, data]);
      setShowAddModal(false);
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

  const handleEditClick = (user) => {
    setEditUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      confirmPassword: ''
    });
    setChangePassword(false);
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setCurrentUser(user);
    setShowDeleteConfirm(true);
  };

  const handleApproveClick = async (user) => {
    setActionInProgress(user.id);
    try {
      // Optimistic update
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, approved: true } : u
      );
      setUsers(updatedUsers);

      const response = await fetch(`http://localhost:8000/api/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ approved: true }),
      });

      if (!response.ok) {
        // Revert on error
        setUsers(users);
        throw new Error('Failed to approve user.');
      }
    } catch (error) {
      console.error('Error approving user:', error);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDisapproveClick = async (user) => {
    setActionInProgress(user.id);
    try {
      // Optimistic update
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, approved: false } : u
      );
      setUsers(updatedUsers);

      const response = await fetch(`http://localhost:8000/api/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ approved: false }),
      });

      if (!response.ok) {
        // Revert on error
        setUsers(users);
        throw new Error('Failed to disapprove user.');
      }
    } catch (error) {
      console.error('Error disapproving user:', error);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    // Validate password if changing password
    if (changePassword && editUser.password !== editUser.confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }
  
    // Create the user data to update
    const userData = {
      name: editUser.name,
      email: editUser.email,
      role: editUser.role, // Now using the correct value directly
    };
  
    // Only include password if changing password and it's provided
    if (changePassword && editUser.password) {
      userData.password = editUser.password;
    }
  
    try {
      // First try with PUT method
      let response = await fetch(`http://localhost:8000/api/users/${editUser.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
      });
  
      // If PUT fails with 400, try with PATCH
      if (!response.ok && response.status === 400) {
        response = await fetch(`http://localhost:8000/api/users/${editUser.id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(userData),
        });
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'Failed to update user');
      }
  
      const updatedData = await response.json();
      
      // Update the users state with the updated user
      setUsers(users.map(user => 
        user.id === editUser.id ? updatedData : user
      ));
      
      setShowEditModal(false);
      setSubmitError('');
      setChangePassword(false);
    } catch (error) {
      setSubmitError(error.message || 'Failed to update user. Please check all fields and try again.');
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${currentUser.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      setUsers(users.filter(user => user.id !== currentUser.id));
      setShowDeleteConfirm(false);
      setCurrentUser(null);
      
      // Optional: Show success message
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      // Optional: Show error message to user
      alert('Failed to delete user. Please try again.');
    }
  };

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
      {
        Header: 'Approved',
        accessor: 'approved',
        Cell: ({ row }) => (
          <span className={`approved-status ${row.original.approved ? 'approved' : 'not-approved'}`}>
            {row.original.approved ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button 
              className="edit-button"
              onClick={() => handleEditClick(row.original)}
              disabled={actionInProgress === row.original.id}
            >
              <FaEdit /> Edit
            </button>
            <button 
              className="delete-button"
              onClick={() => handleDeleteClick(row.original)}
              disabled={actionInProgress === row.original.id}
            >
              <FaTrash /> Delete
            </button>
            {row.original.approved ? (
              <button 
                className="disapprove-button"
                onClick={() => handleDisapproveClick(row.original)}
                disabled={actionInProgress === row.original.id}
              >
                {actionInProgress === row.original.id ? (
                  <FaSpinner className="spinner" />
                ) : (
                  'Disapprove'
                )}
              </button>
            ) : (
              <button 
                className="approve-button"
                onClick={() => handleApproveClick(row.original)}
                disabled={actionInProgress === row.original.id}
              >
                {actionInProgress === row.original.id ? (
                  <FaSpinner className="spinner" />
                ) : (
                  'Approve'
                )}
              </button>
            )}
          </div>
        ),
      },
    ],
    [actionInProgress]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: filteredUsers,
  });

  return (
    <div className="user-table-container">
      <Sidebar />
      <Topbar />
      <h2 className="table-title">User List</h2>
      
      <div className="actions-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by Email or Name"
          className="search-bar"
        />
        <button className="add-user-button" onClick={() => setShowAddModal(true)}>
          Add User
        </button>
      </div>

      {loading && (
        <div className="loading-overlay">
          <FaSpinner className="spinner" />
          <span>Loading users...</span>
        </div>
      )}

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

      {/* Modals remain the same as before */}
      {showAddModal && (
        <div className="modal-overlay">
          {/* Add User Modal Content */}
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
                    <option value="lab_manager">Lab Manager</option>
                    <option value="technician">Technician</option>
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
      )}

      {showEditModal && (
        <div className="modal-overlay">
          {/* Edit User Modal Content */}
          {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit User</h2>
              <button
                className="close-button"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="edit-user-form">
              <div className="form-group">
                <label htmlFor="edit-name">Name</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editUser.name}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-email">Email</label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={editUser.email}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className="form-group">
                  <label htmlFor="edit-role">Role</label>
                  <select
                    id="edit-role"
                    name="role"
                    value={editUser.role}
                    onChange={handleEditInputChange}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                    <option value="lab_manager">Lab Manager</option>
                    <option value="technician">Technician</option>
                  </select>
                </div>
              
              {/* Password change toggle */}
              <div className="password-change-toggle">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={changePassword}
                    onChange={toggleChangePassword}
                  />
                  Change Password
                </label>
              </div>
              
              {/* Password fields that appear when changePassword is true */}
              {changePassword && (
                <>
                  <div className="form-group">
                    <label htmlFor="edit-password">New Password</label>
                    <input
                      type="password"
                      id="edit-password"
                      name="password"
                      value={editUser.password}
                      onChange={handleEditInputChange}
                      required={changePassword}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="edit-confirmPassword"
                      name="confirmPassword"
                      value={editUser.confirmPassword}
                      onChange={handleEditInputChange}
                      required={changePassword}
                    />
                  </div>
                </>
              )}
              
              {submitError && <div className="error-message">{submitError}</div>}
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
      )}

      {showDeleteConfirm && currentUser && (
        <div className="modal-overlay">
          {/* Delete Confirmation Modal Content */}
          {showDeleteConfirm && currentUser && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm-modal">
            <div className="modal-header">
              <h2 className="modal-title">Confirm Delete</h2>
              <button
                className="close-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                ✕
              </button>
            </div>
            <div className="confirm-message">
              <p>Are you sure you want to delete the user <strong>{currentUser.name}</strong>?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button type="button" className="delete-confirm-button" onClick={handleDeleteUser}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default UsersManagement;





