import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

const AdminRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
  );
};

export default AdminRoutes;
