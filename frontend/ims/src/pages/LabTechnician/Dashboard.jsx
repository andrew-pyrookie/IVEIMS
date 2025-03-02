import React from "react";
import LabTechnicianSidebar from "/src/components/LabTechnician/LabTechnicianSidebar.jsx";
import LabTechnicianTopbar from "/src/components/LabTechnician/LabTechnicianTopbar.jsx"

const Dashboard = () => {
    return ( 
        <div>
            <LabTechnicianSidebar/>
            <LabTechnicianTopbar/>
            <h1>DASHBOARD</h1>
        </div>

     );
}
 
export default Dashboard;