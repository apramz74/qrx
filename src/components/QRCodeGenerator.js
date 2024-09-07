import React, { useState, useRef } from "react";
import QRCode from "qrcode";
import styles from "./QRCodeGenerator.module.css";

const QRCodeGenerator = () => {
  const [content, setContent] = useState("");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const canvasRef = useRef(null);

  const handleGenerate = () => {
    QRCode.toCanvas(
      canvasRef.current,
      content,
      {
        width: 256,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
      },
      (error) => {
        if (error) console.error(error);
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <label htmlFor="content">QR Code Content</label>
        <input
          id="content"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter URL or text"
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="foregroundColor">Foreground Color</label>
        <input
          id="foregroundColor"
          type="color"
          value={foregroundColor}
          onChange={(e) => setForegroundColor(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="backgroundColor">Background Color</label>
        <input
          id="backgroundColor"
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>
      <button className={styles.generateButton} onClick={handleGenerate}>
        Generate QR Code
      </button>
      <canvas ref={canvasRef} className={styles.qrCanvas}></canvas>
    </div>
  );
};

export default QRCodeGenerator;
