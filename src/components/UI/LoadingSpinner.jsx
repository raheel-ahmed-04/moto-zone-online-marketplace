import React from "react";
import "../../styles/loading-spinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
