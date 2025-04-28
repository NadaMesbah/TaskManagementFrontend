import React from 'react';
import "./Loader.css"; // Import styles

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p className="loading-text">Loading... Please wait</p>
    </div>
  );
};

export default Loader;
