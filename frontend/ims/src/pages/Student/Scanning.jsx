import React, { useState, useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import "/src/pages/Student/styles/Scanning.css";

function EquipmentScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [equipmentData, setEquipmentData] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);

  // Get authentication token
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please login.');
      return null;
    }
    return token;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(URL.createObjectURL(file));
    setError(null);
    setScanResult(null);
    setEquipmentData(null);
    setIsLoading(true);

    try {
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
        scanRegion: { top: 20, left: 20, width: 60, height: 60 },
        quality: 0.7
      });

      if (!result) throw new Error('QR code could not be read');
      await handleScanResult(result.data);
    } catch (err) {
      setError('QR code could not be read. Please try a clearer image.');
      setIsLoading(false);
    }
  };

  const handleScanResult = async (result) => {
    setScanResult(result);
    setIsLoading(true);
    setError(null);
    setEquipmentData(null);

    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/equipment/?unique_code=${encodeURIComponent(result)}/`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch equipment data');
      }

      const data = await response.json();
      if (!data) throw new Error('No equipment data returned');
      
      setEquipmentData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch equipment details');
      console.error('Scan Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startScanner = () => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);
    setEquipmentData(null);
    setSelectedFile(null);

    const qrScanner = new QrScanner(
      videoRef.current,
      result => {
        handleScanResult(result.data);
        qrScanner.stop();
        setIsScanning(false);
      },
      {
        preferredCamera: 'environment',
        highlightScanRegion: true,
        maxScansPerSecond: 5,
      }
    );

    qrScanner.start()
      .then(() => setScanner(qrScanner))
      .catch(err => {
        setError('Camera access denied. Please check permissions.');
        setIsScanning(false);
      });
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.stop();
      scanner.destroy();
      setScanner(null);
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop();
        scanner.destroy();
      }
    };
  }, [scanner]);

  return (
    <div className="scanner-app">
      <header className="app-header">
        <h1>Equipment Scanner</h1>
        <p>Scan QR code to view equipment details</p>
      </header>

      <main className="scanner-content">
        <div className="scanner-controls">
          {!isScanning ? (
            <div className="upload-section">
              <label className="file-upload-button">
                Upload QR Image
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
              </label>
              <div className="or-divider">OR</div>
              <button 
                onClick={startScanner}
                className="scan-button"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Start Camera Scanner'}
              </button>
            </div>
          ) : (
            <div className="camera-container">
              <video ref={videoRef} className="scanner-video" />
              <button onClick={stopScanner} className="stop-button">
                Stop Scanning
              </button>
            </div>
          )}

          {selectedFile && (
            <div className="image-preview">
              <img src={selectedFile} alt="Uploaded QR code" />
              {scanResult && <div className="scan-result">Scanned: {scanResult}</div>}
            </div>
          )}
        </div>

        {isLoading && <div className="loading-indicator">Loading...</div>}

        {error && (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {equipmentData && (
          <div className="equipment-details">
            <h2>Equipment Details</h2>
            <div className="detail-grid">
              <DetailItem label="Name" value={equipmentData.name} />
              <DetailItem label="Status" value={equipmentData.status} isStatus />
              <DetailItem label="Unique Code" value={equipmentData.unique_code} />
              <DetailItem label="Current Lab" value={equipmentData.current_lab?.name} />
              <DetailItem label="Category" value={equipmentData.category} />
              <DetailItem label="Description" value={equipmentData.description} isFullWidth />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper component for equipment details
const DetailItem = ({ label, value, isStatus, isFullWidth }) => (
  <div className={`detail-item ${isFullWidth ? 'full-width' : ''}`}>
    <span>{label}:</span>
    {isStatus ? (
      <strong className={`status-${value?.toLowerCase() || 'unknown'}`}>
        {value || 'N/A'}
      </strong>
    ) : (
      <strong>{value || 'N/A'}</strong>
    )}
  </div>
);

export default EquipmentScanner;