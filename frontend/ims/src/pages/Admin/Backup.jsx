import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateLab = () => {
  const navigate = useNavigate();
  const [labData, setLabData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLabData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the token from local storage
    const token = localStorage.getItem('token');

    // Validate form data
    if (!labData.name || !labData.description) {
      setError('Name and Description are required');
      return;
    }

    try {
      // Send POST request to create lab
      const response = await axios.post('http://localhost:8000/api/labs/', 
        labData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Clear form and show success message
      setSuccess('Lab created successfully');
      setError('');
      
      // Reset form
      setLabData({
        name: '',
        description: ''
      });

      // Optionally navigate to lab list or detail page
      navigate('/admin/labs');
    } catch (err) {
      // Handle errors
      setError(err.response?.data?.detail || 'Failed to create lab');
      console.error('Lab creation error:', err);
    }
  };

  // Inline styles to match previous styling approach
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f4f4',
    },
    form: {
      background: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      width: '400px',
    },
    inputContainer: {
      marginBottom: '15px',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    submitButton: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#3d4a60',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    error: {
      color: 'red',
      marginBottom: '15px',
    },
    success: {
      color: 'green',
      marginBottom: '15px',
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Create New Lab</h2>
        
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <div style={styles.inputContainer}>
          <input
            type="text"
            name="name"
            placeholder="Lab Name"
            value={labData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputContainer}>
          <textarea
            name="description"
            placeholder="Lab Description"
            value={labData.description}
            onChange={handleChange}
            style={styles.input}
            rows="4"
            required
          />
        </div>

        <button type="submit" style={styles.submitButton}>
          Create Lab
        </button>
      </form>
    </div>
  );
};

export default CreateLab;