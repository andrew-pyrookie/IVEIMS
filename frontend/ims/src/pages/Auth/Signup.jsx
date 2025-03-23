import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaChevronDown, FaCheck, FaEnvelope, FaUser, FaLock } from "react-icons/fa";
import "./Signup.css"; // Import CSS file
import kuImage from "/src/assets/ku.jpg"; // Import the ku.jpg image
import kuBackground from "/src/assets/ku-background.jpg"; // Import the ku-background.jpg image

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const roles = ["student", "technician", "lab manager"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Prepare data for the backend
    const userData = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      role: formData.role.toLowerCase(),
      password: formData.password,
    };

    console.log("Frontend payload:", userData); // Debugging: Log the payload

    try {
      const res = await axios.post("http://localhost:8000/api/auth/register/", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle successful registration
      if (res.data.approved) {
        // If approved, redirect to login page
        setSuccess("Registration approved! Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 2000); // Redirect after 2 seconds
      } else {
        // If not approved, show pending message
        setSuccess("Registration pending admin approval.");
        setTimeout(() => {
          navigate("/landingpage");
        }, 2000); // Redirect after 2 seconds
      }
      setError("");

    } catch (err) {
      console.log("Backend error response:", err.response?.data); // Debugging: Log the error

      // Extract the error message from the backend response
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.email) {
          setError(errorData.email[0]); // Display the first email error
        } else if (errorData.username) {
          setError(errorData.username[0]); // Display the first username error
        } else if (errorData.password) {
          setError(errorData.password[0]); // Display the first password error
        } else {
          setError("Registration failed. Please check your input.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="signup-container" style={{ backgroundImage: `url(${kuBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <form className="signup-form" onSubmit={handleSubmit}>
        <img src={kuImage} alt="KU Logo" className="signup-ku-logo" />
        <h2>Sign Up</h2>

        {/* Name Input */}
        <div className="signup-input-container">
          <FaUser className="signup-input-icon" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Username Input */}
        <div className="signup-input-container">
          <FaUser className="signup-input-icon" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Input */}
        <div className="signup-input-container">
          <FaEnvelope className="signup-input-icon" />
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
        <div className="signup-input-container">
          <FaLock className="signup-input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span className="signup-password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password Input */}
        <div className="signup-input-container">
          <FaLock className="signup-input-icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <span className="signup-password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Display Error Message */}
        {error && <p className="signup-error-msg">{error}</p>}

        {/* Role Dropdown */}
        <div className="signup-dropdown-container">
          <button
            type="button"
            className="signup-dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {formData.role}
            <FaChevronDown />
          </button>
          {isDropdownOpen && (
            <div className="signup-dropdown-menu">
              {roles.map((role) => (
                <div
                  key={role}
                  className={`signup-dropdown-item ${formData.role === role ? "signup-selected" : ""}`}
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

        {/* Display Success Message */}
        {success && <p className="signup-success-msg">{success}</p>}

        <button type="submit" className="signup-submit-button">Sign Up</button>
        <p>Already have an account? <a href="/">Login</a></p>
      </form>
    </div>
  );
};

export default Signup;