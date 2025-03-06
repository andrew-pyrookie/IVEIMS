import React, { useEffect, useState } from "react";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Sidebar from "/src/components/Student/StudentSidebar.jsx";
import Topbar from "/src/components/Student/StudentTopbar.jsx";
import "/src/pages/Student/styles/Projects.css"; 

const Projects = () => {
  const [data, setData] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]); // State to store equipment data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Format date to a readable format (e.g., "January 1, 2023")
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle cases where the date is null or undefined
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch equipment data
  const fetchEquipment = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/equipment/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch equipment data");
      }

      const equipmentData = await response.json();
      setEquipmentList(equipmentData); // Store equipment data in state
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  // Fetch projects data
  const fetchProjects = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/dashboard/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects data");
      }

      const projectsData = await response.json();
      setData(projectsData.projects || []); // Ensure data.projects is an array
      setLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error); // Log the error
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch both equipment and projects data
  useEffect(() => {
    fetchEquipment();
    fetchProjects();
  }, []);

  // Map equipment IDs to their names
  const getEquipmentNames = (equipmentIds) => {
    return equipmentIds
      .map((id) => {
        const equipment = equipmentList.find((eq) => eq.id === id);
        return equipment ? equipment.name : "Unknown Equipment";
      })
      .join(", ");
  };

  // Define table columns
  const columns = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Lab",
        accessor: "lab",
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => <span className="project-description">{value}</span>,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span className={`status-badge status-${value.replace(/\s+/g, "-")}`}>{value}</span>
        ),
      },
      {
        Header: "Start Date",
        accessor: "start_date",
        Cell: ({ value }) => formatDate(value), // Format the start date
      },
      {
        Header: "End Date",
        accessor: "end_date",
        Cell: ({ value }) => formatDate(value), // Format the end date
      },
      {
        Header: "Equipment",
        accessor: "equipment",
        Cell: ({ value }) => getEquipmentNames(value), // Display equipment names
      },
      {
        Header: "Progress",
        accessor: "progress",
        Cell: ({ value }) => `${value}%`,
      },
    ],
    [equipmentList] // Re-run when equipmentList changes
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
      data,
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

  if (loading) {
    return (
      <div className="projects-container">
        <Sidebar/>
        <Topbar/>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading projects data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="projects-container">
        <div className="no-data">No projects found.</div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <Sidebar/>
      <Topbar/>
      <div className="content-header">
        <h1>Projects allocated </h1>
      </div>

      <div className="actions-container">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="search-input"
          />
        </div>
      </div>

      <div className="table-container">
        <table {...getTableProps()} className="projects-table">
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
                  No projects found.
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
    </div>
  );
};

export default Projects;