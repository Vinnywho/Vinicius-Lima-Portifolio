import React, { useState } from "react";

const SpraySplash = ({ videoSrc, onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleVideoEnd = () => {
    setIsVisible(false);
    if (onFinish) onFinish();
  };

  if (!isVisible) return null;

  return (
    <div style={containerStyle}>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="sprayFilter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="-1 1 -1 0 0
                    -1 1 -1 0 0
                    -1 1 -1 0 0
                    -1 1 -1 1 -0.1" 
            result="mask"
          />

          <feGaussianBlur in="mask" stdDeviation="1.5" result="smoothedMask" />

          <feFlood floodColor="#AA1719" result="flood" />
          
          <feComposite in="flood" in2="smoothedMask" operator="in" />
        </filter>
      </svg>

      <video
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        style={{
          ...videoStyle,
          filter: "url(#sprayFilter)",
          transform: "scale(1.02)",
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
};

const containerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "transparent",
  zIndex: 9999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  pointerEvents: "none",
};

const videoStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export default SpraySplash;


    // {!showSite && (
    //   <SpraySplash 
    //       videoSrc="../src/assets/videos/spray3.mp4" 
    //       onFinish={() => setShowSite(true)} 
    //     />
    //   )}