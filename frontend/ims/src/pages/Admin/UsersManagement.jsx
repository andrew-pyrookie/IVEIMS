import React, { useState } from "react";
import "/src/pages/Admin/styles/UserManagement.css";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import { FaUsers, FaUserEdit, FaTrash, FaTimes, FaPlus } from "react-icons/fa";

const UserManagement = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
        { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "Editor" }
    ]);

    const [editingUser, setEditingUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Open Edit Modal
    const handleEdit = (user) => {
        setEditingUser(user);
        setIsAdding(false);
        setModalVisible(true);
    };

    // Open Add User Modal
    const handleAddUser = () => {
        setEditingUser({ id: Date.now(), name: "", email: "", password: "", role: "User" });
        setIsAdding(true);
        setModalVisible(true);
    };

    // Save User (Add or Edit)
    const handleSave = () => {
        if (isAdding) {
            setUsers([...users, editingUser]);
        } else {
            setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        }
        setModalVisible(false);
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="user-main-content">
                <h2>User Management</h2>
                <button className="add-btn" onClick={handleAddUser}>
                    <FaPlus /> Add New User
                </button>
                
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button className="edit-btn1" onClick={() => handleEdit(user)}>
                                        <FaUserEdit />
                                    </button>
                                    <button className="delete-btn1" onClick={() => setUsers(users.filter(u => u.id !== user.id))}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ✨ Add/Edit User Modal ✨ */}
                {modalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>{isAdding ? "Add New User" : "Edit User"}</h3>
                            </div>

                            <label>Name:</label>
                            <input
                                type="text"
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                            />

                            <label>Email:</label>
                            <input
                                type="email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                            />

                            <label>Password:</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                            />

                            <label>Role:</label>
                            <select
                                className="modal-content-role-dropdown"
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                            >
                                <option>Admin</option>
                                <option>User</option>
                                <option>Lab technitian</option>
                                <option>Lab Manager</option>
                            </select>

                            <div className="modal-buttons">
                                <button className="save-btn-UM" onClick={handleSave}>{isAdding ? "Add User" : "Save Changes"}</button>
                                <button className="cancel-btn-UM" onClick={() => setModalVisible(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
