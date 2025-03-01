import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Admin/Dashboard";
import UsersManagement from "../pages/Admin/UsersManagement";
import Inventory from "../pages/Admin/Inventory";
import Bookings from "../pages/Admin/Bookings";
import Reports from "../pages/Admin/Reports";
import Backup from "../pages/Admin/Backup";
import Profile from "../pages/Admin/AdminProfile";
import DesignStudioLab from "../pages/Admin/DesignStudioLab";
import CezeriLab from "../pages/Admin/CezeriLab";
import MedTechLab from "../pages/Admin/MedTechLab";
import Projects from "../pages/Admin/Projects";
import NotFound from "../pages/NotFound/NotFound"; 

const AdminRoutes = () => {
  return (
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/:userId" element={<Dashboard />} />

        <Route path="users" element={<UsersManagement />} />
        <Route path="users/userId" element={<UsersManagement />} />


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

         <Route path="reports" element={<Reports />} />

        <Route path="backup" element={<Backup />} />

        
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:userId" element={<Projects />} />

        <Route path="profile" element={<Profile />} />
        <Route path="profile/:userId" element={<Profile />} />

        <Route path="usermanagement" element={<UsersManagement />} />
        <Route path="usermanagement/:userId" element={<UsersManagement />} />


        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default AdminRoutes;
