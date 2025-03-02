import React, { useEffect, useState } from "react";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { FaQrcode, FaSearch, FaSort, FaSortUp, FaSortDown, FaCalendarAlt } from "react-icons/fa";
import StudentSidebar from "/src/components/Student/StudentSidebar.jsx";
import StudentTopbar from "/src/components/Student/StudentTopbar.jsx";
import "/src/pages/Student/styles/MedTechLab.css";

const MedTechLab = () => {
  const [equipment, setEquipment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    equipmentName: "",
    bookedBy: "",
    userEmail: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/equipment/", {
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

  const handleQRCodeClick = (item) => {
    setCurrentItem(item);
    setShowQRModal(true);
  };

  const handleBookClick = (item) => {
    setCurrentItem(item);
    setBookingFormData({
      equipmentName: item.productName,
      bookedBy: "",
      userEmail: "",
      startTime: "",
      endTime: "",
    });
    setShowBookModal(true);
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData({
      ...bookingFormData,
      [name]: value,
    });
  };

  const handleBookEquipment = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/equipment/bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bookingFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to book equipment");
      }

      // Close the booking modal
      setShowBookModal(false);

      // Show success message
      setShowBookingSuccess(true);

      // Reset the form data
      setBookingFormData({
        equipmentName: "",
        bookedBy: "",
        userEmail: "",
        startTime: "",
        endTime: "",
      });

      // Refresh equipment list to show updated status
      fetchEquipment();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowBookingSuccess(false);
      }, 3000);
    } catch (error) {
      setSubmitError("Failed to book equipment. Please try again.");
      console.error("Error booking equipment:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
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
        Cell: ({ value }) => <span className="equipment-description">{value}</span>,
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
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span className={`status-badge status-${value.replace(/\s+/g, "-")}`}>{value}</span>
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
              className="action-button book-button"
              onClick={() => handleBookClick(row.original)}
              title="Book Equipment"
            >
              <FaCalendarAlt />
              <span className="button-text">Book</span>
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
      <div className="medtech-lab-container">
        <StudentSidebar />
        <div className="main-content">
          <StudentTopbar />
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
      <StudentSidebar />
      <div className="main-content">
        <StudentTopbar />

        <div className="content-header">
          <h1>MedTech Lab Equipment Management</h1>
          <p>View and book equipment in the MedTech Lab</p>
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

        {/* Book Equipment Modal */}
        {showBookModal && currentItem && (
          <div className="modal-overlay">
            <div className="modal-content booking-modal">
              <div className="modal-header">
                <h2 className="modal-title">Book Equipment</h2>
                <button
                  className="close-button"
                  onClick={() => {
                    setShowBookModal(false);
                    setSubmitError("");
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="booking-equipment-details">
                <div className="equipment-image">
                  <span className="equipment-image-placeholder">
                    <FaCalendarAlt />
                  </span>
                </div>
                <div className="equipment-info">
                  <h3>{currentItem.productName}</h3>
                  <div className="equipment-meta">
                    <span>
                      <strong>Status:</strong> {currentItem.status}
                    </span>
                    <span>
                      <strong>Lab:</strong> {currentItem.homeLab}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBookEquipment} className="equipment-form">
                <div className="form-group">
                  <label htmlFor="equipmentName">Equipment Name</label>
                  <input
                    type="text"
                    id="equipmentName"
                    name="equipmentName"
                    value={bookingFormData.equipmentName}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bookedBy">Booked By*</label>
                  <input
                    type="text"
                    id="bookedBy"
                    name="bookedBy"
                    value={bookingFormData.bookedBy}
                    onChange={handleBookingInputChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="userEmail">Email*</label>
                  <input
                    type="email"
                    id="userEmail"
                    name="userEmail"
                    value={bookingFormData.userEmail}
                    onChange={handleBookingInputChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="startTime">Start Time*</label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      name="startTime"
                      value={bookingFormData.startTime}
                      onChange={handleBookingInputChange}
                      required
                    />
                  </div>

                  <div className="form-group half">
                    <label htmlFor="endTime">End Time*</label>
                    <input
                      type="datetime-local"
                      id="endTime"
                      name="endTime"
                      value={bookingFormData.endTime}
                      onChange={handleBookingInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="availability-indicator">
                  <div
                    className={`availability-dot ${
                      currentItem.status === "available" ? "available" : "booked"
                    }`}
                  ></div>
                  <span>Current status: {currentItem.status}</span>
                </div>

                {submitError && <div className="error-message">{submitError}</div>}

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowBookModal(false);
                      setSubmitError("");
                    }}
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
                    src={`/api/placeholder/200/200`}
                    alt={`QR Code for ${currentItem.productName}`}
                    className="qr-code-image"
                  />
                </div>
                <div className="qr-details">
                  <h3>{currentItem.productName}</h3>
                  <p className="qr-description">{currentItem.description}</p>
                  <p>
                    <strong>ID:</strong> {currentItem.id}
                  </p>
                  <p>
                    <strong>Home Lab:</strong> {currentItem.homeLab}
                  </p>
                </div>
              </div>
              <div className="qr-actions">
                <button className="print-button">Print QR Code</button>
                <button className="download-button">Download QR Code</button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Success Modal */}
        {showBookingSuccess && (
          <div className="modal-overlay">
            <div className="modal-content booking-modal">
              <div className="booking-success">
                <div className="success-icon">✓</div>
                <h3>Booking Successful!</h3>
                <p>Your equipment has been booked successfully.</p>
                <button
                  className="view-bookings-button"
                  onClick={() => setShowBookingSuccess(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedTechLab;