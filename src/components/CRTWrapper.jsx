import React from 'react';
import './CRTWrapper.css';

const CRTWrapper = ({ children, background }) => {
  return (
    <div className="crt-container">
      {background}
      <div className="scanlines"></div>
      <div className="vignette"></div>
      <div className="screen-content">
        {children}
      </div>
    </div>
  );
};

export default CRTWrapper;
