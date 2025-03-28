import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaChevronDown, FaCheck, FaEnvelope, FaUser, FaLock } from "react-icons/fa";
import "./Signup.css";
import kuImage from "/src/assets/ku.jpg";
import kuBackground from "/src/assets/ku-background.jpg";

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

  const roles = ["student", "technician", "lab_manager"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const userData = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      role: formData.role.toLowerCase(),
      password: formData.password,
    };

    try {
      const res = await axios.post("http://localhost:8000/api/auth/register/", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Store tokens in local storage
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (res.data.refresh) {
          localStorage.setItem('refreshToken', res.data.refresh);
        }
        
        // Store basic user info
        localStorage.setItem('user', JSON.stringify({
          id: res.data.user?.id,
          name: res.data.user?.name,
          email: res.data.user?.email,
          role: res.data.user?.role,
          approved: res.data.user?.approved
        }));
      }

      if (res.data.user?.approved && res.data.token ) {
        localStorage.setItem('token', res.data.token);
        setSuccess("Registration successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else { 
        localStorage.setItem('token', res.data.token);
        setSuccess("Registration successful! Login to check your approval status ");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
      setError("");

    } catch (err) {
      console.error("Registration error:", err.response?.data);
      
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.email) {
          setError(Array.isArray(errorData.email) ? errorData.email[0] : errorData.email);
        } else if (errorData.username) {
          setError(Array.isArray(errorData.username) ? errorData.username[0] : errorData.username);
        } else if (errorData.password) {
          setError(Array.isArray(errorData.password) ? errorData.password[0] : errorData.password);
        } else if (errorData.non_field_errors) {
          setError(errorData.non_field_errors[0]);
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
            placeholder="Password (min 8 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
          />
          <span 
            className="signup-password-toggle" 
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide password" : "Show password"}
          >
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
            minLength="8"
          />
          <span 
            className="signup-password-toggle" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            title={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Role Dropdown */}
        <div className="signup-dropdown-container">
          <button
            type="button"
            className="signup-dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
            <FaChevronDown className={`signup-dropdown-chevron ${isDropdownOpen ? "signup-rotate" : ""}`} />
          </button>
          {isDropdownOpen && (
            <div className="signup-dropdown-menu" role="listbox">
              {roles.map((role) => (
                <div
                  key={role}
                  className={`signup-dropdown-item ${formData.role === role ? "signup-selected" : ""}`}
                  onClick={() => {
                    setFormData({ ...formData, role });
                    setIsDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={formData.role === role}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                  {formData.role === role && <FaCheck className="signup-check-icon" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Display Error Message */}
        {error && <div className="signup-error-msg" role="alert">{error}</div>}

        {/* Display Success Message */}
        {success && <div className="signup-success-msg" role="status">{success}</div>}

        <button type="submit" className="signup-submit-button">
          Sign Up
        </button>
        
        <p className="signup-login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;