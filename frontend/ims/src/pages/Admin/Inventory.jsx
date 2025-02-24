import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import DatePicker from "react-datepicker";
import "/src/pages/Admin/styles/Inventory.css";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaEdit, FaTrash, FaTable, FaThLarge } from "react-icons/fa";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    status: "Available",
    lastMaintained: null,
    nextMaintenance: null,
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"

  // Handle Adding a New Item
  const handleAddItem = () => {
    if (newItem.name.trim() !== "") {
      if (editingIndex !== null) {
        const updatedItems = [...items];
        updatedItems[editingIndex] = newItem;
        setItems(updatedItems);
        setEditingIndex(null);
      } else {
        setItems([...items, { ...newItem, id: Date.now() }]);
      }
      setNewItem({ name: "", status: "Available", lastMaintained: null, nextMaintenance: null });
      setIsAdding(false);
    }
  };

  // Handle Editing an Item
  const handleEditItem = (index) => {
    setNewItem(items[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  // Handle Deleting an Item
  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="inventory-container">
      <Sidebar />

      {/* Main Content */}
      <div className="main-contentInventory">
        <h2>🛠️ Equipment Tracking</h2>

        {/* View Toggle Buttons */}
        <div className="view-toggle">
          <button className={viewMode === "table" ? "active" : ""} onClick={() => setViewMode("table")}>
            <FaTable /> Table
          </button>
          <button className={viewMode === "card" ? "active" : ""} onClick={() => setViewMode("card")}>
            <FaThLarge /> Card
          </button>
        </div>

        {/* Add Equipment Button */}
        <button className="add-button" onClick={() => setIsAdding(!isAdding)}>
          <FaPlus /> Add Equipment
        </button>

        {/* Add/Edit Equipment Card */}
        {isAdding && (
          <div className="add-item-card">
            <h3>{editingIndex !== null ? "Edit Equipment" : "Add Equipment"}</h3>

            <input
              type="text"
              placeholder="Enter equipment name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />

            <select className="add-item-card-dropdown" value={newItem.status} onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}>
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
            </select>

            {/* Last Maintained Date */}
            <DatePicker
              selected={newItem.lastMaintained}
              onChange={(date) => setNewItem({ ...newItem, lastMaintained: date })}
              placeholderText="Last Maintained"
            />

            {/* Next Maintenance Date */}
            <DatePicker
              selected={newItem.nextMaintenance}
              onChange={(date) => setNewItem({ ...newItem, nextMaintenance: date })}
              placeholderText="Next Maintenance"
            />

            <button className="add-item-card-button" onClick={handleAddItem}>{editingIndex !== null ? "Update" : "Add"} Equipment</button>
          </div>
        )}

        {/* Equipment Table View */}
        {viewMode === "table" && (
          <div className="table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Status</th>
                  <th>Last Maintained</th>
                  <th>Next Maintenance</th>
                  <th>QR Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.status}</td>
                    <td>{item.lastMaintained ? item.lastMaintained.toDateString() : "N/A"}</td>
                    <td>{item.nextMaintenance ? item.nextMaintenance.toDateString() : "N/A"}</td>
                    <td>
                      <QRCodeCanvas value={JSON.stringify(item)} size={50} />
                    </td>
                    <td>
                      <FaEdit className="edit-icon" onClick={() => handleEditItem(index)} />
                      <FaTrash className="delete-icon" onClick={() => handleDeleteItem(index)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Equipment Card View */}
        {viewMode === "card" && (
          <div className="inventory-card-container">
            {items.map((item, index) => (
              <div key={item.id} className="inventory-card">
                {/* Edit & Delete Icons on Top-Right */}
                <div className="card-actions">
                  <FaEdit className="edit-icon" onClick={() => handleEditItem(index)} />
                  <FaTrash className="delete-icon" onClick={() => handleDeleteItem(index)} />
                </div>

                {/* Card Content */}
                <h3>{item.name}</h3>
                <p>
                  <strong>Status:</strong> {item.status}
                </p>
                <p>
                  <strong>Last Maintained:</strong> {item.lastMaintained ? item.lastMaintained.toDateString() : "N/A"}
                </p>
                <p>
                  <strong>Next Maintenance:</strong> {item.nextMaintenance ? item.nextMaintenance.toDateString() : "N/A"}
                </p>
                <QRCodeCanvas value={JSON.stringify(item)} size={70} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;