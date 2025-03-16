// src/components/FileUpload.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import AnalysisResult from "../AnalysisResult/AnalysisResult";
import "./FileUpload.scss";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  // File picker handler
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  // Upload logic
  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("binary", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="inner-wrapper">
        <div className="hero-container">
          <h1 className="big-title">
            <span className="gradient-text">ELF</span>alyze
          </h1>
        </div>
        <div
          className={`upload-wrapper ${dragActive ? "drag-active" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={(e) => {
            // Only open file picker if click is NOT on the button
            if (e.target.tagName !== "BUTTON") {
              openFilePicker();
            }
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <p className="upload-text">
            {file
              ? `Selected: ${file.name}`
              : "Drag & Drop your ELF file here or click to select"}
          </p>
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>
        </div>
        {result && <AnalysisResult data={result} />}
      </div>
    </div>
  );
};

export default FileUpload;
