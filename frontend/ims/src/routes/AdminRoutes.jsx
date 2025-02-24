import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import UsersManagement from "../pages/admin/UsersManagement";
import Inventory from "../pages/admin/Inventory";
import Bookings from "../pages/admin/Bookings";
import Reports from "../pages/admin/Reports";
import Backup from "../pages/admin/Backup";

const AdminRoutes = () => {
  return (
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="reports" element={<Reports />} />
        <Route path="backup" element={<Backup />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
  );
};

export default AdminRoutes;
