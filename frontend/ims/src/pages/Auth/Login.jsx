import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Importing icons
import "./Login.css"; // Import Login styles

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
      const res = await axios.post("http://localhost:8000/api/login/", formData);
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("user_id", res.data.user_id);
      setError("");
  
      if (res.data.user.role === "student") {
        navigate(`/student/dashboard/${res.data.user.id}`);
      } else if (res.data.user.role === "admin") {
        navigate(`/admin/dashboard/${res.data.user.id}`);
      } else if (res.data.user.role === "Lab Manager") {
        navigate("/lab-manager-dashboard");
      } else {
        navigate("/"); // Default redirection
      }
  
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };
  

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </form>
    </div>
  );
};




export default Login;
