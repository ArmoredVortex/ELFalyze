// src/components/FileUpload.jsx
import React, { useState } from "react";
import axios from "axios";
import AnalysisResult from "../AnalysisResult/AnalysisResult";
import "./FileUpload.scss";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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
        <h1>ELFalyze - Analyze ELF Binaries</h1>
        <div className="upload-wrapper">
          <input type="file" onChange={handleFileChange} />
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
