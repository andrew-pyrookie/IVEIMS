
import React, { useState, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import "/src/pages/Student/styles/Scanning.css";
import Topbar from "/src/components/Student/StudentTopbar.jsx";

const EquipmentQRScanner = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [equipmentDetails, setEquipmentDetails] = useState(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token'); // Adjust this if you store your token differently
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      }
    };
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await QrScanner.scanImage(file);
      validateAndFetch(result);
    } catch (error) {
      setError('Failed to scan QR code. Please try another image.');
      console.error('Scanning error:', error);
    }
  };

  const startScanning = () => {
    if (!videoRef.current) return;
  
    setIsScanning(true);
    scannerRef.current = new QrScanner(
      videoRef.current, 
      (result) => {
        validateAndFetch(result);
        stopScanning(); // This will stop the scanner and remove highlights
      },
      {
        onDecodeError: (error) => {
          // Silent on decode errors
        },
        highlightScanRegion: false, // Set to false to remove region highlights
        highlightCodeOutline: false, // Set to false to remove code outline
        preferredCamera: 'environment',
      }
    );
    scannerRef.current.start();
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  const validateAndFetch = (result) => {
    console.log('Raw QR Scanner Result:', result);
    
    const code = typeof result === 'object' ? result.data : result;
    console.log('Extracted Code:', code);
  
    if (!code || code.length < 3) {
      setError('Invalid QR code format');
      return;
    }
    
    setScannedCode(code);
    fetchEquipmentDetails(code);
  };

  const fetchEquipmentDetails = async (uniqueCode) => {
    const token = getAuthToken();
    if (!token) {
      setError('You need to be logged in to scan equipment');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/equipment/by-qr/?unique_code=${encodeURIComponent(uniqueCode)}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }

      if (response.status === 404) {
        throw new Error('Equipment not found');
      }
      
      if (response.status === 403) {
        throw new Error('You do not have permission to view this equipment');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch equipment details');
      }

      const data = await response.json();
      setEquipmentDetails(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error fetching equipment details');
      setEquipmentDetails(null);
      console.error('Error:', err);
    }
  };

  const renderEquipmentDetails = () => {
    if (!equipmentDetails) return null;

    return (
      <div className="equipment-details">
        <Topbar />
        <h2>Equipment Details</h2>
        <div className="qr-code-preview">
          {equipmentDetails.qr_code && (
            <img 
              src={equipmentDetails.qr_code} 
              alt="Equipment QR Code" 
              className="qr-code-image"
            />
          )}
        </div>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <td>{equipmentDetails.name}</td>
            </tr>
            <tr>
              <th>Current Lab</th>
              <td>{equipmentDetails.current_lab}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td className={`status-${equipmentDetails.status}`}>
                {equipmentDetails.status}
              </td>
            </tr>
            <tr>
              <th>Unit Price</th>
              <td>${equipmentDetails.unit_price}</td>
            </tr>
            <tr>
              <th>Quantity</th>
              <td>{equipmentDetails.quantity}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{equipmentDetails.description || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // Update your return statement to look like this:
return (
    <div className="qr-scanner-container">
      <Topbar />
      <h1>Equipment QR Scanner</h1>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')} className="dismiss-button">
            Dismiss
          </button>
        </div>
      )}
      
      <div className="scanner-actions">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="file-input"
          hidden
        />
        <button 
          onClick={() => fileInputRef.current.click()}
          className="action-button1 upload-button"
        >
          Upload QR Image
        </button>
        
        {!isScanning ? (
          <button 
            onClick={startScanning}
            className="action-button1 scan-button"
          >
            Start Camera Scan
          </button>
        ) : (
          <button 
            onClick={stopScanning}
            className="action-button1 stop-button"
          >
            Stop Scanning
          </button>
        )}
      </div>
  
      <div className="scanner-video-container">
  <video 
    ref={videoRef} 
    className="scanner-video"
    style={{ display: isScanning ? 'block' : 'none' }}
  />
  {isScanning && (
    <div className="scanner-overlay">
      <div className="scanner-frame">
        <div className="scanner-frame-corner-bottom-left"></div>
        <div className="scanner-frame-corner-bottom-right"></div>
        <div className="scanner-instruction">Position QR code within this frame</div>
      </div>
      <div className="scanning-animation"></div>
    </div>
  )}
</div>
  
      {scannedCode && (
        <div className="scanned-code">
          <p>Scanned Code: <code>{scannedCode}</code></p>
        </div>
      )}
  
      {renderEquipmentDetails()}
    </div>
  );
};

export default EquipmentQRScanner;