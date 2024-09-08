import React, { useState, useRef } from "react";
import QRCode from "qrcode";
import styles from "./QRCodeGenerator.module.css";
import { supabase } from "../supabaseClient"; // Make sure to import supabase client

const QRCodeGenerator = () => {
  const [content, setContent] = useState("");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const canvasRef = useRef(null);

  const createQRCode = async (
    userId,
    content,
    foregroundColor,
    backgroundColor
  ) => {
    try {
      const { data, error } = await supabase
        .from("qr_codes")
        .insert({
          content: content,
          foreground_color: foregroundColor,
          background_color: backgroundColor,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving QR code to database:", error);
      throw error;
    }
  };

  const handleGenerate = async () => {
    try {
      const userId = "current-user-id"; // Get this from your auth system
      const qrCode = await createQRCode(
        userId,
        content,
        foregroundColor,
        backgroundColor
      );

      QRCode.toCanvas(
        canvasRef.current,
        qrCode.content,
        {
          width: 256,
          color: {
            dark: qrCode.foreground_color,
            light: qrCode.background_color,
          },
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
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
