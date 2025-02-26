import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Student/Dashboard";
import Bookings from "../pages/Student/Bookings";
import Documents from "../pages/Student/Documents";
import Profile from "../pages/Student/Profile";
import Projects from "../pages/Student/Projects";

const StudentRoutes = () => {
  return (
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/:userId" element={<Dashboard />} />

        <Route path="documents" element={<Documents />} />

        <Route path="profile" element={<Profile />} />
        <Route path="profile/:userId" element={<Profile />} />

        <Route path="bookings" element={<Bookings />} />
        <Route path="bookings/:userId" element={<Bookings />} />

        <Route path="projects" element={<Projects />} />
        <Route path="projects/:userId" element={<Projects />} />
        
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
  );
};

export default StudentRoutes;
