import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import Sidebar from "/src/components/Admin/Sidebar.jsx";
import Topbar from "/src/components/Admin/Topbar.jsx";
import "/src/pages/Admin/styles/Dashboard.css";

const Dashboard = () => {
  // Set up state to hold the individual data
  const [totalUsers, setTotalUsers] = useState(0);
  const [equipmentAvailable, setEquipmentAvailable] = useState(0);
  const [pendingEquipmentBookings, setPendingEquipmentBookings] = useState(0);
  const [pendingLabBookings, setPendingLabBookings] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0); // New state for total bookings
  const [notification, setNotification] = useState("");
  const [equipmentStatusData, setEquipmentStatusData] = useState([]);
  const [labEquipmentData, setLabEquipmentData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Modern color palette
  const STATUS_COLORS = ["#06D6A0", "#118AB2", "#EF476F"];
  const LAB_COLORS = ["#5465FF", "#788BFF", "#9BB1FF", "#BFD7FF", "#E2FDFF"];

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch data for each stat from its API
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/api/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch total users");
        }
        const data = await response.json();
        setTotalUsers(data.length); // Assuming the response is an array of users
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    const fetchEquipmentData = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/api/equipment/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch equipment data");
        }
        const data = await response.json();
        
        // Set equipment total
        setEquipmentAvailable(data.length);
        
        // Process equipment status for pie chart
        const statusCounts = {
          available: 0,
          inUse: 0,
          maintenance: 0
        };
        
        // Count equipment by lab
        const labCounts = {};
        
        // Process equipment data
        data.forEach(item => {
          // Count by status
          if (item.status === "available") statusCounts.available++;
          else if (item.status === "in_use") statusCounts.inUse++;
          else if (item.status === "maintenance") statusCounts.maintenance++;
          
          // Count by lab
          if (item.lab) {
            if (!labCounts[item.lab]) {
              labCounts[item.lab] = 0;
            }
            labCounts[item.lab]++;
          }
        });
        
        // Format data for pie chart
        const statusChartData = [
          { name: "Available", value: statusCounts.available },
          { name: "In Use", value: statusCounts.inUse },
          { name: "Maintenance", value: statusCounts.maintenance }
        ];
        
        // Format data for lab chart
        const labChartData = Object.keys(labCounts).map(lab => ({
          name: lab,
          count: labCounts[lab]
        })).sort((a, b) => b.count - a.count); // Sort by count, descending
        
        setEquipmentStatusData(statusChartData);
        setLabEquipmentData(labChartData);
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      }
    };

    const fetchPendingEquipmentBookings = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/api/pending-equipment-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch pending equipment bookings");
        }
        const data = await response.json();
        setPendingEquipmentBookings(data.pendingEquipmentBookings);
      } catch (error) {
        console.error("Error fetching pending equipment bookings:", error);
      }
    };

    const fetchPendingLabBookings = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch pending lab bookings");
        }
        const data = await response.json();
        setPendingLabBookings(data.pendingLabBookings);
      } catch (error) {
        console.error("Error fetching pending lab bookings:", error);
      }
    };

    const fetchTotalBookings = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/api/bookings/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch total bookings");
        }
        const data = await response.json();
        setTotalBookings(data.length); // Assuming the response is an array of bookings
      } catch (error) {
        console.error("Error fetching total bookings:", error);
      }
    };

    const fetchNotification = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/api/notification", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch notification");
        }
        const data = await response.json();
        setNotification(data.notification);
      } catch (error) {
        console.error("Error fetching notification:", error);
      }
    };

    // Fetch all data
    fetchTotalUsers();
    fetchEquipmentData();
    fetchPendingEquipmentBookings();
    fetchPendingLabBookings();
    fetchTotalBookings(); // Fetch total bookings
    fetchNotification();
  }, []);

  // Active shape for animated hover effect on pie chart
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={14}>{`${payload.name}: ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={12}>
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
  };

  // Handle pie segment hover
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Custom tooltip component for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${payload[0].name}`}</p>
          <p className="tooltip-value">{`${payload[0].value} items`}</p>
          <p className="tooltip-percent">{`${(payload[0].payload.percent * 100).toFixed(0)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip component for bar chart
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${payload[0].payload.name}`}</p>
          <p className="tooltip-value">{`${payload[0].value} equipment items`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Topbar />
      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-icon">👥</div>
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{totalUsers}</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">📦</div>
            <div className="stat-label">Equipment Available</div>
            <div className="stat-value">{equipmentAvailable}</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">📅</div>
            <div className="stat-label">Total Equipment Bookings</div>
            <div className="stat-value">{totalBookings}</div> {/* Display total bookings here */}
          </div>
          <div className="stat-box">
            <div className="stat-icon">📅</div>
            <div className="stat-label">Pending Lab Bookings</div>
            <div className="stat-value">{pendingLabBookings}</div>
          </div>
        </div>
        

        <div className="all-chart-container">
        {/* Equipment Status Pie Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h2 className="chart-title">Equipment Status</h2>
            <div className="chart-legend">
              {equipmentStatusData.map((entry, index) => (
                <div key={`legend-${index}`} className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }}></div>
                  <span className="legend-text">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-content">
            <div className="pie-chart-wrapper">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={equipmentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {equipmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-summary">
              <div className="summary-title">Equipment Status Summary</div>
              <div className="summary-stats">
                {equipmentStatusData.map((entry, index) => (
                  <div key={`stat-${index}`} className="summary-stat">
                    <div className="stat-num" style={{ color: STATUS_COLORS[index % STATUS_COLORS.length] }}>{entry.value}</div>
                    <div className="stat-desc">{entry.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Equipment by Lab Bar Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h2 className="chart-title">Equipment Distribution by Lab</h2>
          </div>
          <div className="chart-content">
            <div className="bar-chart-wrapper">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={labEquipmentData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar 
                    dataKey="count" 
                    name="Equipment Count" 
                    radius={[4, 4, 0, 0]}
                  >
                    {labEquipmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={LAB_COLORS[index % LAB_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="lab-distribution-summary">
            <div className="lab-summary-title">Lab Equipment Summary</div>
            <div className="lab-summary-stats">
              {labEquipmentData.map((lab, index) => (
                <div key={`lab-stat-${index}`} className="lab-stat-item">
                  <div className="lab-stat-color" style={{ backgroundColor: LAB_COLORS[index % LAB_COLORS.length] }}></div>
                  <div className="lab-stat-name">{lab.name}</div>
                  <div className="lab-stat-count">{lab.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;