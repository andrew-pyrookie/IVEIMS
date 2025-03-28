import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import NotFound from "../pages/NotFound/NotFound"; 
import LandingPage from "../pages/Auth/landingpage";

const AuthRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        <Route path="landingpage" element={<LandingPage />} />
        <Route path="landingpage/:userId" element={<LandingPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default AuthRoutes;
