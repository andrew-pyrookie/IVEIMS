import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/LabTechnician/Dashboard";
import Inventory from "../pages/LabTechnician/Inventory";
import Bookings from "../pages/LabTechnician/Bookings";
import Reports from "../pages/LabTechnician/Reports";
import DesignStudioLab from "../pages/LabTechnician/DesignStudioLab";
import CezeriLab from "../pages/LabTechnician/CezeriLab";
import MedTechLab from "../pages/LabTechnician/MedTechLab";
import NotFound from "../pages/NotFound/NotFound"; 

const LabTechnicianRoutes = () => {
  return (
      <Routes>

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/:userId" element={<Dashboard />} />


        <Route path="designstudiolab" element={<DesignStudioLab />} />
        <Route path="designstudiolab/:userId" element={<DesignStudioLab />} />


        <Route path="cezerilab" element={<CezeriLab />} />
        <Route path="cezerilab/:userId" element={<CezeriLab />} />

        <Route path="medtechlab" element={<MedTechLab />} />
        <Route path="medtechlab/:userId" element={<MedTechLab />} />

        <Route path="inventory" element={<Inventory />} />
        <Route path="inventory/:userId" element={<Inventory />} />

        <Route path="bookings" element={<Bookings />} />
        <Route path="bookings/:userId" element={<Bookings />} />

        <Route path="reports" element={<Reports />} />
        <Route path="reports/:userId" element={<Reports />} />

        

        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default LabTechnicianRoutes;
