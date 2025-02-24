import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaChevronDown, FaCheck, FaEnvelope } from "react-icons/fa";
import "./Signup.css"; // Import CSS file

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Select Role",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const roles = ["student", "Lab Technician", "admin"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password,
    };

    try {
      const res = await axios.post("http://localhost:8000/api/register/", userData);
      setSuccess(res.data.message);
      setError("");

      localStorage.setItem("userId", res.data.user.id); // Store the user ID

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
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        {/* Name Input */}
        <div className="input-container">
          <FaEnvelope className="input-icon" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

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

        {/* Password Input */}
        <div className="input-container">
          <FaEnvelope className="input-icon" />
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

        {/* Confirm Password Input */}
        <div className="input-container">
          <FaEnvelope className="input-icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Role Dropdown */}
        <div className="dropdown-container">
          <button
            type="button"
            className="dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {formData.role}
            <FaChevronDown />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {roles.map((role) => (
                <div
                  key={role}
                  className={`dropdown-item ${formData.role === role ? "selected" : ""}`}
                  onClick={() => {
                    setFormData({ ...formData, role });
                    setIsDropdownOpen(false);
                  }}
                >
                  {role}
                  {formData.role === role && <FaCheck />}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <button type="submit" className="submit-button">Sign Up</button>
        <p>Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
};

export default Signup;
