import React, { useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { FaFilePdf, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { usePDF } from "react-to-pdf";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/MedTechLab.css";

const Reports = () => {
  const [labReports, setLabReports] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeReport, setActiveReport] = useState("lab"); // 'lab' or 'user'
  const { toPDF, targetRef } = usePDF({ filename: `${activeReport}-report.pdf` });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // Fetch lab reports (equipment transfers)
      const labResponse = await fetch("http://localhost:8000/api/reports/lab", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const labData = await labResponse.json();
      setLabReports(labData);

      // Fetch user reports (user joins)
      const userResponse = await fetch("http://localhost:8000/api/reports/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const userData = await userResponse.json();
      setUserReports(userData);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Columns for Lab Report (Equipment Transfers)
  const labColumns = React.useMemo(
    () => [
      {
        Header: "Equipment Name",
        accessor: "equipmentName",
      },
      {
        Header: "From Lab",
        accessor: "fromLab",
      },
      {
        Header: "To Lab",
        accessor: "toLab",
      },
      {
        Header: "Transfer Date",
        accessor: "transferDate",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
    ],
    []
  );

  // Columns for User Report (User Joins)
  const userColumns = React.useMemo(
    () => [
      {
        Header: "User Name",
        accessor: "userName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Join Date",
        accessor: "joinDate",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
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
      columns: activeReport === "lab" ? labColumns : userColumns,
      data: activeReport === "lab" ? labReports : userReports,
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
            <p>Loading reports...</p>
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
          <h1>Reports</h1>
          <p>View and download lab and user reports</p>
        </div>

        <div className="actions-container">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports..."
              className="search-input"
            />
          </div>
          <div className="report-type-buttons">
            <button
              className={`report-type-button ${activeReport === "lab" ? "active" : ""}`}
              onClick={() => setActiveReport("lab")}
            >
              Lab Report
            </button>
            <button
              className={`report-type-button ${activeReport === "user" ? "active" : ""}`}
              onClick={() => setActiveReport("user")}
            >
              User Report
            </button>
          </div>
          <button className="add-button" onClick={toPDF}>
            <FaFilePdf /> Download PDF
          </button>
        </div>

        <div className="table-container" ref={targetRef}>
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
                  <td colSpan={activeReport === "lab" ? labColumns.length : userColumns.length} className="no-data">
                    No reports found.
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
            Showing {page.length} of {activeReport === "lab" ? labReports.length : userReports.length} results
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
      </div>
    </div>
  );
};

export default Reports;