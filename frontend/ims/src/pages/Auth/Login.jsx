import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Importing icons
import "./Login.css"; // Import Login styles
import kuImage from "/src/assets/ku.jpg"; // Import the ku.jpg image
import kuBackground from "/src/assets/ku-background.jpg"; // Import the ku-background.jpg image

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login/", formData);
      
      // Check if the user is approved
      if (!res.data.user.approved) { // Check the `approved` field
        setError("Registration pending, waiting for approval.");
        localStorage.setItem("token", res.data.access);
        setTimeout(() => {
          navigate("/landingpage");
        }, 2000); // Redirect after 2 seconds
        return; // Stop further execution
      }
  
      // If approved, proceed with login
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("user_id", res.data.user.id);
      localStorage.setItem("password", res.data.user.name);
      localStorage.setItem("username", res.data.user.name);
      setError("");
  
      if (res.data.user.role === "student") {
        navigate(`/student/dashboard/${res.data.user.id}`);
      } else if (res.data.user.role === "admin") {
        navigate(`/admin/dashboard/${res.data.user.id}`);
      } else if (res.data.user.role === "lab_manager") {
        navigate(`/labmanager/dashboard/${res.data.user.id}`);
      }else if (res.data.user.role === "technician") {
        navigate(`/labtechnician/dashboard/${res.data.user.id}`);
      }else {
        navigate("/"); 
      }
  
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${kuBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <form className="login-form" onSubmit={handleSubmit}>
        <img src={kuImage} alt="KU Logo" className="ku-logo" />
        <h2>Login</h2>
        {/* Email Input */}
        <div className="input-container">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Input with Toggle */}
        <div className="input-container">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="submuz">Login</button>
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </form>
    </div>
  );
};

export default Login;