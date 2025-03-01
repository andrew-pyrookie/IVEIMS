import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/LabManager/Dashboard";
import Inventory from "../pages/LabManager/Inventory";
import Bookings from "../pages/LabManager/Bookings";
import Reports from "../pages/LabManager/Reports";
import DesignStudioLab from "../pages/LabManager/DesignStudioLab";
import CezeriLab from "../pages/LabManager/CezeriLab";
import MedTechLab from "../pages/LabManager/MedTechLab";
import Projects from "../pages/LabManager/Projects";
import SharedResourses from "../pages/LabManager/SharedResourses";
import NotFound from "../pages/NotFound/NotFound"; 

const LabManagerRoutes = () => {
  return (
      <Routes>
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:userId" element={<Projects />} />

        <Route path="sharedresourses" element={<SharedResourses />} />
        <Route path="sharedresourses/:userId" element={<SharedResourses />} />  


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

export default LabManagerRoutes;
