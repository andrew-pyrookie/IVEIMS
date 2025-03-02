import React, { useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { FaFilePdf, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { usePDF } from "react-to-pdf";
import LabManagerSidebar from "/src/components/LabManager/LabManagerSidebar.jsx";
import LabManagerTopbar from "/src/components/LabManager/LabManagerTopbar.jsx";
import "/src/pages/LabManager/styles/Reports.css";

const Reports = () => {
  const [labReports, setLabReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toPDF, targetRef } = usePDF({ filename: "lab-report.pdf" });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // Fetch lab reports (equipment transfers)
      const labResponse = await fetch("http://localhost:8000/api/reports/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const labData = await labResponse.json();
      
      // Calculate duration for each report
      const labReportsWithDuration = labData.map(report => {
        // Assuming report has startTime and endTime properties
        // If the data structure is different, you'll need to adjust this
        const startTime = new Date(report.startTime || report.transferDate);
        const endTime = new Date(report.endTime || report.transferDate);
        
        // Calculate duration in milliseconds and convert to minutes
        const durationMs = endTime - startTime;
        const durationMinutes = Math.floor(durationMs / (1000 * 60));
        
        return {
          ...report,
          duration: durationMinutes
        };
      });
      
      setLabReports(labReportsWithDuration);
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
      {
        Header: "Duration (minutes)",
        accessor: "duration",
        Cell: ({ value }) => (value ? `${value} mins` : "N/A"),
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
      columns: labColumns,
      data: labReports,
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
        <LabManagerSidebar />
        <div className="main-content">
          <LabManagerTopbar />

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
       <LabManagerSidebar />
      <div className="main-content">
      <LabManagerTopbar />

        <div className="content-header">
          <h1>Lab Reports</h1>
          <p>View and download equipment transfer reports</p>
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
                  <td colSpan={labColumns.length} className="no-data">
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
            Showing {page.length} of {labReports.length} results
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