import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import LabTechnicianRoutes from "./routes/LabTechnicianRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import LabManagerRoutes from "./routes/LabManagerRoutes";


function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/*" element={<AuthRoutes />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Technician Dashboard Routes */}
        <Route path="/labtechnician/*" element={<LabTechnicianRoutes />} />

        {/* Student Dashboard Routes */}
        <Route path="/student/*" element={<StudentRoutes />} />

         {/* LaBManager Dashboard Routes */}
         <Route path="/labmanager/*" element={<LabManagerRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
