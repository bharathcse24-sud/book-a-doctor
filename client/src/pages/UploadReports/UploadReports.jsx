import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { uploadReport } from '../../services/api';
import './UploadReports.css';

const UploadReports = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(f.type)) {
      setError('Only PDF, JPG, and PNG files are allowed.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File size must be under 10 MB.');
      return;
    }
    setFile(f);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    handleFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) return setError('Please select a file.');
    const formData = new FormData();
    formData.append('report', file);
    setUploading(true);
    setError('');
    try {
      await uploadReport(id, formData);
      setSuccess(`"${file.name}" uploaded successfully!`);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page page-content">
      <div className="container">
        <div className="upload-wrapper animate-fadeInUp">
          <div className="upload-header">
            <Link to="/my-appointments" className="back-link">← Back to Appointments</Link>
            <h1>Upload Medical Report</h1>
            <p>Upload your medical reports or test results for this appointment.</p>
          </div>

          {success && (
            <div className="alert alert-success">
              ✅ {success}
            </div>
          )}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Drop Zone */}
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
          >
            <input
              ref={fileRef}
              type="file"
              id="report-file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {file ? (
              <div className="file-preview">
                <div className="file-icon">
                  {file.type.includes('pdf') ? '📄' : '🖼️'}
                </div>
                <div className="file-info">
                  <strong>{file.name}</strong>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button
                  className="remove-file"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                >✕</button>
              </div>
            ) : (
              <div className="drop-zone-prompt">
                <div className="drop-icon">☁️</div>
                <h3>Drag & Drop or Click to Upload</h3>
                <p>Supports PDF, JPG, PNG • Max 10 MB</p>
              </div>
            )}
          </div>

          {/* Upload Types Info */}
          <div className="upload-types">
            <div className="upload-type-item"><span>📋</span>Lab Reports</div>
            <div className="upload-type-item"><span>🩻</span>X-Rays / Scans</div>
            <div className="upload-type-item"><span>💊</span>Prescriptions</div>
            <div className="upload-type-item"><span>📄</span>Medical Records</div>
          </div>

          <button
            id="upload-btn"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px' }}
            onClick={handleUpload}
            disabled={uploading || !file}
          >
            {uploading ? '⏳ Uploading...' : '📤 Upload Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadReports;
