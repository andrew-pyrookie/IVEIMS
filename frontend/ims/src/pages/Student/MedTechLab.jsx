import React, { useEffect, useState } from "react";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { FaQrcode, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Sidebar from "/src/components/Student/StudentSidebar.jsx";
import Topbar from "/src/components/Student/StudentTopbar.jsx";
import "/src/pages/Admin/styles/MedTechLab.css";

// Define the formatDate function
const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // Handle cases where the date is null or undefined
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MedTechLab = () => {
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]); // State to store labs data
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    equipment_id: "",
    lab_space_id: "",
    start_time: "",
    end_time: "",
    status: "pending",
    project: "",
  });
  const [showBookedEquipmentsModal, setShowBookedEquipmentsModal] = useState(false);
  const [bookedEquipments, setBookedEquipments] = useState([]);

  // Fetch equipment and labs data
  useEffect(() => {
    fetchEquipment();
    fetchLabs(); // Fetch labs data when the component mounts
  }, []);

  // Fetch equipment data
  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/equipment/by-lab/2/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch equipment data");
      }

      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch labs data
  const fetchLabs = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/labs/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch labs data");
      }

      const data = await response.json();
      setLabs(data); // Set the fetched labs data to the state
    } catch (error) {
      console.error("Error fetching labs:", error);
    }
  };

  // Fetch booked equipment data
  const fetchBookedEquipments = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/bookings/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch booked equipment data");
      }

      const data = await response.json();
      console.log("Booked Equipments Data:", data); // Log the API response
      setBookedEquipments(data);
      setShowBookedEquipmentsModal(true);
    } catch (error) {
      console.error("Error fetching booked equipment:", error);
    }
  };

  // Handle QR code click
  const handleQRCodeClick = (item) => {
    setCurrentItem(item);
    setShowQRModal(true);
  };

  // Handle booking click
  const handleBookingClick = (item) => {
    setCurrentItem(item);
    // Reset the booking form data for the new equipment
    setBookingFormData({
      equipment_id: item.id, // Set the new equipment ID
      lab_space_id: "",
      start_time: "",
      end_time: "",
      status: "pending",
      project: "",
    });
    setShowBookingModal(true);
  };

  // Handle booking form input changes
  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData({
      ...bookingFormData,
      [name]: value,
    });
  };

  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    // Convert start_time and end_time to Date objects for comparison
    const startTime = new Date(bookingFormData.start_time);
    const endTime = new Date(bookingFormData.end_time);

    // Validate that end_time is after start_time
    if (endTime <= startTime) {
      alert("End time must be after start time.");
      return; // Stop the submission if validation fails
    }

    const payload = {
      equipment_id: bookingFormData.equipment_id,
      lab_space_id: bookingFormData.lab_space_id,
      start_time: bookingFormData.start_time,
      end_time: bookingFormData.end_time,
      status: bookingFormData.status,
      project: bookingFormData.project,
    };

    try {
      const response = await fetch("http://localhost:8000/api/bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to book equipment");
      }

      const bookingData = await response.json();
      console.log("Booking successful:", bookingData);
      setShowBookingModal(false);
    } catch (error) {
      console.error("Error booking equipment:", error);
    }
  };

  // Define table columns
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => <span className="equipment-description">{value}</span>,
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Total Price",
        accessor: "total_price",
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: "Unit Price",
        accessor: "unit_price",
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span className={`status-badge status-${value.replace(/\s+/g, "-")}`}>{value}</span>
        ),
      },
      {
        Header: "Home Lab",
        accessor: "home_lab",
      },
      {
        Header: "Current Lab",
        accessor: "current_lab",
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
              className="action-button booking-button"
              onClick={() => handleBookingClick(row.original)}
              title="Book Equipment"
            >
              Book
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Table setup
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
      <div className="medtech-lab-container">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading equipment data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="medtech-lab-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />

        <div className="content-header">
          <h1>MedTech Lab Equipment Management</h1>
          <p>Manage all equipment in the MedTech Lab</p>
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
          <button
            className="view-booked-equipments-button"
            onClick={fetchBookedEquipments}
          >
            View Booked Equipments
          </button>
        </div>

        <div className="table-container">
          <table {...getTableProps()} className="equipment-table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      <div className="header-content">
                        {column.render("Header")}
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
                    No equipment found.
                  </td>
                </tr>
              ) : (
                page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
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
              {"<<"}
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="pagination-button"
            >
              {"<"}
            </button>
            <span className="pagination-page-info">
              Page <strong>{pageIndex + 1}</strong> of <strong>{pageOptions.length}</strong>
            </span>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="pagination-button"
            >
              {">"}
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="pagination-button"
            >
              {">>"}
            </button>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
              className="pagination-size-select"
            >
              {[10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>

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
                  <img
                    src={currentItem.qr_code}
                    alt={`QR Code for ${currentItem.name}`}
                    className="qr-code-image"
                  />
                </div>
                <div className="qr-details">
                  <h3>{currentItem.name}</h3>
                  <p className="qr-description">{currentItem.description}</p>
                  <p>
                    <strong>ID:</strong> {currentItem.id}
                  </p>
                  <p>
                    <strong>Home Lab:</strong> {currentItem.home_lab}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && currentItem && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Book Equipment</h2>
                <button
                  className="close-button"
                  onClick={() => setShowBookingModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleBookingSubmit} className="equipment-form">
                <div className="form-group">
                  <label htmlFor="lab_space_id">Lab Space*</label>
                  <select
                    id="lab_space_id"
                    name="lab_space_id"
                    value={bookingFormData.lab_space_id}
                    onChange={handleBookingInputChange}
                    required
                  >
                    <option value="">Select a lab space</option>
                    {labs.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        {lab.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="start_time">Start Time*</label>
                  <input
                    type="datetime-local"
                    id="start_time"
                    name="start_time"
                    value={bookingFormData.start_time}
                    onChange={handleBookingInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_time">End Time*</label>
                  <input
                    type="datetime-local"
                    id="end_time"
                    name="end_time"
                    value={bookingFormData.end_time}
                    onChange={handleBookingInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="project">Project ID*</label>
                  <input
                    type="text"
                    id="project"
                    name="project"
                    value={bookingFormData.project}
                    onChange={handleBookingInputChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowBookingModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Book Equipment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Booked Equipments Modal */}
        {showBookedEquipmentsModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Booked Equipments</h2>
                <button
                  className="close-button"
                  onClick={() => setShowBookedEquipmentsModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="booked-equipments-list">
                {bookedEquipments.length === 0 ? (
                  <p>No equipment booked.</p>
                ) : (
                  <table className="booked-equipments-table">
                    <thead>
                      <tr>
                        <th>Equipment Name</th>
                        <th>Lab Space</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookedEquipments.map((booking) => (
                        <tr key={booking.id}>
                          <td>{booking.equipment}</td> {/* Use the equipment field */}
                          <td>{booking.lab_space}</td> {/* Lab space */}
                          <td>{formatDate(booking.start_time)}</td> {/* Formatted start time */}
                          <td>{formatDate(booking.end_time)}</td> {/* Formatted end time */}
                          <td>{booking.status}</td> {/* Status */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedTechLab;