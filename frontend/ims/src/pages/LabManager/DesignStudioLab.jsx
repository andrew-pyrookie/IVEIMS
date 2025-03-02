import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { FaEdit, FaTrash, FaQrcode, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import LabManagerSidebar from "/src/components/LabManager/LabManagerSidebar.jsx";
import LabManagerTopbar from "/src/components/LabManager/LabManagerTopbar.jsx";
import "/src/pages/LabManager/styles/CezeriLab.css";

const DesignStudio = () => {
  const [equipment, setEquipment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    equipmentName: '',
    quantity: 1,
    status: 'available',
    homeLab: '',
    currentLab: '',
    lastMaintenance: '',
    nextMaintenance: '',
  });

  const statusOptions = ['available', 'in use', 'maintenance'];
  const labOptions = ['MedTech Lab', 'Cezeri Lab', 'Design Studio Lab'];

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/equipment/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch equipment data');
      }

      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditClick = (item) => {
    setFormData({
      description: item.description,
      equipmentName: item.equipmentName,
      quantity: item.quantity,
      status: item.status,
      homeLab: item.homeLab,
      currentLab: item.currentLab,
      lastMaintenance: item.lastMaintenance || '',
      nextMaintenance: item.nextMaintenance || '',
    });
    setCurrentItem(item);
    setShowEditModal(true);
  };

  const handleDeleteClick = (item) => {
    setCurrentItem(item);
    setShowDeleteConfirm(true);
  };

  const handleQRCodeClick = (item) => {
    setCurrentItem(item);
    setShowQRModal(true);
  };

  const resetForm = () => {
    setFormData({
      description: '',
      equipmentName: '',
      quantity: 1,
      status: 'available',
      homeLab: '',
      currentLab: '',
      lastMaintenance: '',
      nextMaintenance: '',
    });
    setSubmitError('');
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/api/equipment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add equipment');
      }

      const newItem = await response.json();
      setEquipment([...equipment, newItem]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      setSubmitError('Failed to add equipment. Please try again.');
      console.error('Error adding equipment:', error);
    }
  };

  const handleUpdateEquipment = async (e) => {
    e.preventDefault();
  
    try {
      // Create an object with only the updated fields
      const updatedFields = {};
      for (const key in formData) {
        if (formData[key] !== currentItem[key]) {
          updatedFields[key] = formData[key];
        }
      }
  
      // If no fields were updated, show an error and return
      if (Object.keys(updatedFields).length === 0) {
        setSubmitError("No fields were updated.");
        return;
      }
  
      // Send only the updated fields to the backend
      const response = await fetch(`http://localhost:8000/api/equipment/${currentItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedFields),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update equipment");
      }
  
      // Update the equipment list with the new data
      const updatedItem = await response.json();
      setEquipment((prevEquipment) =>
        prevEquipment.map((item) =>
          item.id === currentItem.id ? { ...item, ...updatedFields } : item
        )
      );
  
      // Close the edit modal and reset the form
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      setSubmitError("Failed to update equipment. Please try again.");
      console.error("Error updating equipment:", error);
    }
  };

  const handleDeleteEquipment = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/equipment/${currentItem.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete equipment');
      }

      setEquipment(equipment.filter(item => item.id !== currentItem.id));
      setShowDeleteConfirm(false);
      setCurrentItem(null);
    } catch (error) {
      console.error('Error deleting equipment:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Define the columns for the table
  const columns = React.useMemo(
    () => [
      {
        Header: "Product Name",
        accessor: "productName",
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => (
          <span className="equipment-description">{value}</span>
        ),
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: "Total Price",
        accessor: "totalPrice",
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span className={`status-badge status-${value.replace(/\s+/g, "-")}`}>
            {value}
          </span>
        ),
      },
      {
        Header: "Home Lab",
        accessor: "homeLab",
      },
      {
        Header: "Current Lab",
        accessor: "currentLab",
      },
      {
        Header: "Last Maintenance",
        accessor: "lastMaintenance",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Next Maintenance",
        accessor: "nextMaintenance",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button
              className="action-button qr-button"
              onClick={() => handleQRCodeClick(row.original)}
              title="View QR Code"
            >
              <FaQrcode />
            </button>
            <button
              className="action-button edit-button"
              onClick={() => handleEditClick(row.original)}
              title="Edit Equipment"
            >
              <FaEdit />
            </button>
            <button
              className="action-button delete-button"
              onClick={() => handleDeleteClick(row.original)}
              title="Delete Equipment"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data: equipment,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  useEffect(() => {
    setGlobalFilter(searchTerm);
  }, [searchTerm, setGlobalFilter]);

  if (isLoading) {
    return (
      <div className="design-studio-container">
        <LabManagerSidebar />
        <div className="main-content">
          <LabManagerTopbar />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading equipment data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="design-studio-container">
      <LabManagerSidebar />

      <div className="main-content">
      <LabManagerTopbar />
        
        <div className="content-header">
          <h1>Design Studio Equipment</h1>
          <p>Manage all equipment in the design studio</p>
        </div>
        
        <div className="actions-container">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search equipment..."
              className="search-input"
            />
          </div>
          <button className="add-button" onClick={() => setShowAddModal(true)}>
            Add New Equipment
          </button>
        </div>

        <div className="table-container">
          <table {...getTableProps()} className="equipment-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      <div className="header-content">
                        {column.render('Header')}
                        <span className="sort-icon">
                          {column.canSort ? (
                            column.isSorted ? (
                              column.isSortedDesc ? (
                                <FaSortDown />
                              ) : (
                                <FaSortUp />
                              )
                            ) : (
                              <FaSort />
                            )
                          ) : null}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="no-data">
                    No equipment found. Add some equipment to get started.
                  </td>
                </tr>
              ) : (
                page.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing {page.length} of {equipment.length} results
          </div>
          <div className="pagination-buttons">
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="pagination-button"
            >
              {'<<'}
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="pagination-button"
            >
              {'<'}
            </button>
            <span className="pagination-page-info">
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="pagination-button"
            >
              {'>'}
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="pagination-button"
            >
              {'>>'}
            </button>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
              className="pagination-size-select"
            >
              {[10, 25, 50].map(size => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Equipment Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Add New Equipment</h2>
                <button
                  className="close-button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddEquipment} className="equipment-form">
                <div className="form-group">
                  <label htmlFor="equipmentName">Equipment Name*</label>
                  <input
                    type="text"
                    id="equipmentName"
                    name="equipmentName"
                    value={formData.equipmentName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description*</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="quantity">Quantity*</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group half">
                    <label htmlFor="status">Status*</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="homeLab">Home Lab*</label>
                    <select
                      id="homeLab"
                      name="homeLab"
                      value={formData.homeLab}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a lab</option>
                      {labOptions.map(lab => (
                        <option key={lab} value={lab}>
                          {lab}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group half">
                    <label htmlFor="currentLab">Current Lab*</label>
                    <select
                      id="currentLab"
                      name="currentLab"
                      value={formData.currentLab}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a lab</option>
                      {labOptions.map(lab => (
                        <option key={lab} value={lab}>
                          {lab}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="lastMaintenance">Last Maintenance Date</label>
                    <input
                      type="date"
                      id="lastMaintenance"
                      name="lastMaintenance"
                      value={formData.lastMaintenance}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group half">
                    <label htmlFor="nextMaintenance">Next Maintenance Date</label>
                    <input
                      type="date"
                      id="nextMaintenance"
                      name="nextMaintenance"
                      value={formData.nextMaintenance}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                {submitError && <div className="error-message">{submitError}</div>}
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Add Equipment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Equipment Modal */}
        {showEditModal && currentItem && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Edit Equipment</h2>
                <button
                  className="close-button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleUpdateEquipment} className="equipment-form">
                <div className="form-group">
                  <label htmlFor="edit-equipmentName">Equipment Name</label>
                  <input
                    type="text"
                    id="edit-equipmentName"
                    name="equipmentName"
                    value={formData.equipmentName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-description">Description</label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="edit-quantity">Quantity</label>
                    <input
                      type="number"
                      id="edit-quantity"
                      name="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={handleInputChange}
                    />
                  </div>
                
                  <div className="form-group half">
                    <label htmlFor="edit-status">Status</label>
                    <select
                      id="edit-status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                    
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="edit-homeLab">Home Lab</label>
                    <select
                      id="edit-homeLab"
                      name="homeLab"
                      value={formData.homeLab}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a lab</option>
                      {labOptions.map((lab) => (
                        <option key={lab} value={lab}>
                          {lab}
                        </option>
                      ))}
                    </select>
                  </div>
                    
                  <div className="form-group half">
                    <label htmlFor="edit-currentLab">Current Lab</label>
                    <select
                      id="edit-currentLab"
                      name="currentLab"
                      value={formData.currentLab}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a lab</option>
                      {labOptions.map((lab) => (
                        <option key={lab} value={lab}>
                          {lab}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                    
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="edit-lastMaintenance">Last Maintenance Date</label>
                    <input
                      type="date"
                      id="edit-lastMaintenance"
                      name="lastMaintenance"
                      value={formData.lastMaintenance}
                      onChange={handleInputChange}
                    />
                  </div>
                    
                  <div className="form-group half">
                    <label htmlFor="edit-nextMaintenance">Next Maintenance Date</label>
                    <input
                      type="date"
                      id="edit-nextMaintenance"
                      name="nextMaintenance"
                      value={formData.nextMaintenance}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                    
                {submitError && <div className="error-message">{submitError}</div>}
                    
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Update Equipment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && currentItem && (
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
                <p>Are you sure you want to delete <strong>{currentItem.equipmentName}</strong>?</p>
                <p>This action cannot be undone.</p>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
                <button type="button" className="delete-confirm-button" onClick={handleDeleteEquipment}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQRModal && currentItem && (
          <div className="modal-overlay">
            <div className="modal-content qr-modal">
              <div className="modal-header">
                <h2 className="modal-title">Equipment QR Code</h2>
                <button
                  className="close-button"
                  onClick={() => setShowQRModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="qr-content">
                <div className="qr-code-container">
                  {/* This would typically be an actual QR code image from your API */}
                  <img 
                    src={`/api/placeholder/200/200`} 
                    alt={`QR Code for ${currentItem.equipmentName}`} 
                    className="qr-code-image"
                  />
                </div>
                <div className="qr-details">
                  <h3>{currentItem.equipmentName}</h3>
                  <p className="qr-description">{currentItem.description}</p>
                  <p><strong>ID:</strong> {currentItem.id}</p>
                  <p><strong>Home Lab:</strong> {currentItem.homeLab}</p>
                </div>
              </div>
              <div className="qr-actions">
                <button className="print-button">Print QR Code</button>
                <button className="download-button">Download QR Code</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignStudio;