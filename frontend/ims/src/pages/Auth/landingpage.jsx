import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarClock, Database, Layers, Lock, Users, Share2, Box, ClipboardList } from 'lucide-react';
import './landingpage.css';
import undraw from '/src/assets/undraw.svg';
import undraw1 from '/src/assets/undraw1.svg';

const IvEOfferingsShowcase = () => {
  const navigate = useNavigate();
  const [isApproved, setIsApproved] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check approval status
  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found, user not authenticated');
          setIsApproved(false);
          setIsLoading(false);
          return;
        }
        
        const response = await fetch('http://localhost:8000/api/auth/check-approval/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          setIsApproved(false);
          setIsLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        setIsApproved(data.approved);
        if (data.approved == true) {
          setShowPopup(true);
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
        setIsApproved(false);
      } finally {
        setIsLoading(false);
      }
    };
  
    checkApprovalStatus();
  }, []);

  const handleLoginRedirect = () => {
    // Get user data from localStorage or make an API call
    const token = localStorage.getItem('token');
    
    if (!token) {
      // If no token, redirect to login page
      navigate('/login');
      return;
    }
  
    // Fetch user data to determine role
    fetch('http://localhost:8000/api/auth/check-approval/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.role === "student") {
        navigate(`/student/dashboard/${data.id}`);
      } else if (data.role === "admin") {
        navigate(`/admin/dashboard/${data.id}`);
      } else if (data.role === "lab_manager") { // Note the underscore
        navigate("/lab-manager-dashboard");
      } else {
        navigate("/"); // Default redirection
      }
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      navigate('/login'); // Redirect to login if there's an error
    });
  };

  // Offerings data
  const offerings = [
    {
      title: 'User Management',
      description: 'Role-based access control with custom dashboards for admins, technicians, students, and lab managers across all facilities.',
      icon: <Users size={32} />,
      features: ['Role-based access control', 'User authentication & profiles', 'Custom dashboards'],
    },
    {
      title: 'Inventory Management',
      description: 'Complete tracking system for equipment and tools with maintenance scheduling and cross-lab asset sharing.',
      icon: <Box size={32} />,
      features: ['Equipment tracking with QR codes', 'Automated maintenance reminders', 'Asset sharing between labs'],
    },
    {
      title: 'Project Management',
      description: 'Comprehensive project tracking with resource allocation and documentation management for all design work.',
      icon: <ClipboardList size={32} />,
      features: ['Project status tracking', 'Resource allocation', 'Documentation storage'],
    },
    {
      title: 'Booking System',
      description: 'Reserve equipment, machines, and lab spaces with smart time slot allocation and detailed usage logs.',
      icon: <CalendarClock size={32} />,
      features: ['Equipment reservations', 'Lab space booking', 'Usage tracking'],
    },
    {
      title: 'Lab Integration',
      description: 'Seamless integration between Design Studio, Cezeri Lab, and MedTech Lab with shared inventory and data syncing.',
      icon: <Share2 size={32} />,
      features: ['Cross-lab visibility', 'Automatic data syncing', 'Unified management'],
    },
    {
      title: 'Data Security',
      description: 'Enterprise-grade data security with offline storage, automated backups, and encryption for sensitive information.',
      icon: <Lock size={32} />,
      features: ['Offline data storage', 'Automated backups', 'Data encryption'],
    },
  ];

  if (isLoading) {
    return (
      <div className="app-container loading">
        <div className="loading-spinner"></div>
        <p>Checking your approval status...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Hero section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Offline Information Management System</h1>
          <h2>Kenyatta University Design Studio</h2>
          <p>
            An integrated solution connecting the Design Studio with Cezeri Lab and MedTech Lab to streamline operations and enhance collaboration.
          </p>
          {isApproved === false && (
            <div className="pending-container">
              <p>Your registration is pending approval. Please check back after 24 hours.</p>
              <button 
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
              >
                Check Approval Status Again
              </button>
            </div>
          )}
          <div className="hero-buttons">
            <button className="btn btn-secondary">
              Learn More <ArrowRight size={16} />
            </button>
            <button className="btn btn-primary">Join Design Challenge</button>
          </div>
        </div>
        <div className="hero-image">
          <img src={undraw} alt="Design Studio Management" />
        </div>
      </header>

      {/* Popup for approved registration */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-content">
              <h3>Registration Approved!</h3>
              <p>Your account has been approved by the administrator.</p>
              <p>You can now login to access the system.</p>
              <div className="popup-buttons">
                <button 
                  className="btn btn-primary" 
                  onClick={handleLoginRedirect}
                >
                  Proceed to Login
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowPopup(false)}
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="main-content">
        <div className="section-header">
          <h2>Our Comprehensive Solution</h2>
          <p>
            The IvE Design Challenge is looking for innovative teams to develop a state-of-the-art information management system with the following key features:
          </p>
        </div>

        {/* Offerings grid */}
        <div className="offerings-grid">
          {offerings.map((offering, index) => (
            <div key={index} className="offering-card">
              <div className="offering-icon">{offering.icon}</div>
              <h3>{offering.title}</h3>
              <p className="offering-description">{offering.description}</p>
              <ul className="feature-list">
                {offering.features.map((feature, idx) => (
                  <li key={idx}>
                    <div className="feature-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Labs integration section */}
        <div className="integration-section">
          <div className="integration-content">
            <div className="integration-text">
              <h2>Integrated Lab Ecosystem</h2>
              <p>
                Our system provides seamless integration between three critical innovation spaces at Kenyatta University:
              </p>
              <div className="lab-list">
                <div className="lab-item">
                  <div className="lab-icon">
                    <Layers size={20} />
                  </div>
                  <div className="lab-details">
                    <h3>Design Studio</h3>
                    <p>The main innovation hub for design projects and prototyping</p>
                  </div>
                </div>
                <div className="lab-item">
                  <div className="lab-icon">
                    <Database size={20} />
                  </div>
                  <div className="lab-details">
                    <h3>Cezeri Lab</h3>
                    <p>Advanced engineering and robotics research facility</p>
                  </div>
                </div>
                <div className="lab-item">
                  <div className="lab-icon">
                    <Lock size={20} />
                  </div>
                  <div className="lab-details">
                    <h3>MedTech Lab</h3>
                    <p>Medical technology innovation and development center</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="integration-image">
              <img src={undraw1} alt="Integrated Lab Ecosystem" />
            </div>
          </div>
        </div>

        {/* Challenge information */}
        <div className="challenge-section">
          <h2>Design Challenge Details</h2>
          <div className="challenge-grid">
            <div className="challenge-info">
              <h3>Key Dates</h3>
              <ul className="date-list">
                <li>
                  <CalendarClock size={16} />
                  <span>Info Session: February 12, 2025 at 7pm (Virtual)</span>
                </li>
                <li>
                  <CalendarClock size={16} />
                  <span>Challenge Finale: March 7, 2025 at IvE Design Studio</span>
                </li>
              </ul>
            </div>
            <div className="challenge-info">
              <h3>Rewards</h3>
              <ul className="rewards-list">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                  <span>Cash prizes for top 3 teams</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                  </svg>
                  <span>Opportunity for further development engagement</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="challenge-cta">
            <button className="btn btn-primary">Register for Design Challenge</button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <div className="footer-about">
              <h3>IvE Design Studio</h3>
              <p>
                Chandaria Business Incubation and Innovation Centre<br />
                Kenyatta University
              </p>
            </div>
            <div className="footer-contact">
              <h4>Contact Us</h4>
              <p>Email: ive@ku.ac.ke</p>
            </div>
          </div>
          <div className="footer-copyright">
            <p>© 2025 IvE Design Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IvEOfferingsShowcase;