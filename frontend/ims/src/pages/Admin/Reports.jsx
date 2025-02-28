import React, { useEffect, useState, useRef } from 'react';
import { useTable } from 'react-table';
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/Reports.css"; // Import the CSS file

// Updated import for react-to-pdf
import { usePDF } from 'react-to-pdf';

const ReportPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [equipment, setEquipment] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [equipmentLoading, setEquipmentLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('transfer_log_report');
  const [pdfError, setPdfError] = useState(null);
  
  // Use the usePDF hook instead of direct toPDF function
  const { toPDF, targetRef } = usePDF({
    filename: `${fileName}.pdf`,
    page: {
      // You can adjust these settings as needed
      margin: 20,
      format: 'a4',
      orientation: 'landscape',
    },
    overrides: {
      // Optional: Add custom styling for PDF
      pdf: {
        compress: true
      },
      canvas: {
        // Optional: Adjust quality
        scale: 2
      }
    }
  });

  // Fetch transfer data from the API
  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/asset-transfers/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transfer data');
        }

        const data = await response.json();
        setTransfers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTransfers();
  }, []);

  // Fetch equipment data for all equipment IDs in transfers
  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      if (transfers.length === 0 || !Array.isArray(transfers)) {
        setEquipmentLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        const equipmentIds = [...new Set(transfers.map(transfer => transfer.equipment_id))];
        const equipmentData = {};
        
        await Promise.all(equipmentIds.map(async (id) => {
          if (!id) return; // Skip if ID is null or undefined
          
          const response = await fetch(`http://localhost:8000/api/equipment/${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            equipmentData[id] = data;
          } else {
            console.warn(`Could not fetch details for equipment ID ${id}`);
            equipmentData[id] = { name: 'Unknown' };
          }
        }));
        
        setEquipment(equipmentData);
        setEquipmentLoading(false);
      } catch (err) {
        console.error('Error fetching equipment details:', err);
        setEquipmentLoading(false);
      }
    };

    if (!loading && transfers.length > 0) {
      fetchEquipmentDetails();
    }
  }, [transfers, loading]);

  // Filter transfers based on search term
  const filteredTransfers = transfers.filter((transfer) =>
    transfer.from_lab.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.to_lab.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (equipment[transfer.equipment_id]?.name && 
     equipment[transfer.equipment_id].name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Define columns for the table
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'From Lab',
        accessor: 'from_lab',
      },
      {
        Header: 'To Lab',
        accessor: 'to_lab',
      },
      {
        Header: 'Transfer Date',
        accessor: 'transfer_date',
        Cell: ({ value }) => {
          const date = new Date(value);
          return date.toLocaleDateString();
        }
      },
      {
        Header: 'Equipment ID',
        accessor: 'equipment_id',
      },
      {
        Header: 'Equipment Name',
        accessor: row => equipment[row.equipment_id]?.name || 'Loading...',
        id: 'equipment_name',
      },
      {
        Header: 'Synced',
        accessor: 'is_synced',
        Cell: ({ value }) => (value ? 'Yes' : 'No'),
      },
    ],
    [equipment]
  );

  // Use react-table to create the table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: filteredTransfers });

  // Updated function to download the report as PDF
  const downloadPDF = () => {
    setPdfError(null);
    
    try {
      toPDF()
        .then(() => console.log('PDF generated successfully'))
        .catch(err => {
          console.error('PDF generation failed:', err);
          setPdfError(err.message || 'Failed to generate PDF');
        });
    } catch (err) {
      console.error('Error generating PDF:', err);
      setPdfError(err.message || 'Failed to generate PDF');
    }
  };

  if (loading) {
    return <div className="loading-container">Loading transfer data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="report-container">
      <Sidebar />
      <Topbar />
      <h2 className="page-title">Transfer Log</h2>

      {/* Search Bar and Download Options */}
      <div className="actions-container">
        <input
          type="text"
          placeholder="Search by Lab or Equipment Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        
        <div className="export-options">
          <input
            type="text"
            placeholder="File name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="filename-input"
          />
          <button 
            className="download-button" 
            onClick={downloadPDF}
            disabled={equipmentLoading}
          >
            {equipmentLoading ? 'Loading Equipment Data...' : 'Download Report (PDF)'}
          </button>
        </div>
      </div>

      {/* PDF Error Message */}
      {pdfError && (
        <div className="error-message pdf-error">
          <p>Error generating PDF: {pdfError}</p>
          <p>Please ensure react-to-pdf is correctly installed:</p>
          <code>npm install --save react-to-pdf</code>
        </div>
      )}

      {/* Content to be exported as PDF - now using targetRef */}
      <div className="pdf-content" ref={targetRef}>
        

        {/* Report Summary */}
        <div className="report-summary">
          <p>Generated on: {new Date().toLocaleDateString()}</p>
          <p>Total transfers: <strong>{filteredTransfers.length}</strong></p>
          {searchTerm && <p>Filtered by: <strong>{searchTerm}</strong></p>}
        </div>

        {/* Table */}
        <div className="table-wrapper">
          {equipmentLoading ? (
            <div className="loading-inline">Loading equipment details...</div>
          ) : (
            <table {...getTableProps()} className="transfers-table">
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th key={column.id} {...column.getHeaderProps()}>
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.length > 0 ? (
                  rows.map(row => {
                    prepareRow(row);
                    return (
                      <tr key={row.id} {...row.getRowProps()}>
                        {row.cells.map(cell => (
                          <td key={cell.column.id + "-" + cell.row.id} {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="no-data">
                      No transfer records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Report Footer - This will appear in the PDF */}
        <div className="report-footer">
          <p>This is an official report from Asset Management System</p>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;