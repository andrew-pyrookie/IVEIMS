import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Student/Dashboard";
import Profile from "../pages/Student/Profile";
import Projects from "../pages/Student/Projects";
import DesignStudioLab from "../pages/Student/DesignStudioLab";
import CezeriLab from "../pages/Student/CezeriLab";
import MedTechLab from "../pages/Student/MedTechLab";
import Scanner from "../pages/Student/Scanning"; 
import NotFound from "../pages/NotFound/NotFound"; 

const StudentRoutes = () => {
  return (
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/:userId" element={<Dashboard />} />

        <Route path="scanning" element={<Scanner />} />
        <Route path="scanning/:userId" element={<Scanner />} />

        <Route path="profile" element={<Profile />} />
        <Route path="profile/:userId" element={<Profile />} />

        <Route path="designstudiolab" element={<DesignStudioLab />} />
        <Route path="designstudiolab/:userId" element={<DesignStudioLab />} />


        <Route path="cezerilab" element={<CezeriLab />} />
        <Route path="cezerilab/:userId" element={<CezeriLab />} />

        <Route path="medtechlab" element={<MedTechLab />} />
        <Route path="medtechlab/:userId" element={<MedTechLab />} />

        <Route path="projects" element={<Projects />} />
        <Route path="projects/:userId" element={<Projects />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default StudentRoutes;
