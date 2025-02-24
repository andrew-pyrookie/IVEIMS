import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import TechnicianRoutes from "./routes/TechnicianRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import AuthRoutes from "./routes/AuthRoutes";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/*" element={<AuthRoutes />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Technician Dashboard Routes */}
        <Route path="/technician/*" element={<TechnicianRoutes />} />

        {/* Student Dashboard Routes */}
        <Route path="/student/*" element={<StudentRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
