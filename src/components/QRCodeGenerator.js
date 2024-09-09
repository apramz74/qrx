import React, { useState } from "react";
import styles from "./QRCodeGenerator.module.css";
import { supabase } from "../supabaseClient";
import { generateQRCode } from "../utils/qrCodeGenerator";

const QRCodeGenerator = () => {
  const [content, setContent] = useState("");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [qrCodeImage, setQrCodeImage] = useState("");

  const createQRCode = async (content, foregroundColor, backgroundColor) => {
    try {
      const qrCodeId = crypto.randomUUID(); // Generate a unique ID for the QR code
      const redirectUrl = content; // Use the content as the redirect URL
      const trackingUrl = `${
        process.env.NEXT_PUBLIC_APP_URL
      }/api/track-visit?qr_code_id=${encodeURIComponent(
        qrCodeId
      )}&redirect_url=${encodeURIComponent(redirectUrl)}`;

      const qrCodeDataUrl = await generateQRCode(
        trackingUrl,
        foregroundColor,
        backgroundColor
      );

      const { data, error } = await supabase
        .from("qr_codes")
        .insert({
          id: qrCodeId,
          content: content,
          foreground_color: foregroundColor,
          background_color: backgroundColor,
          qr_code_url: qrCodeDataUrl,
          redirect_url: redirectUrl,
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
      const qrCode = await createQRCode(
        content,
        foregroundColor,
        backgroundColor
      );

      setQrCodeImage(qrCode.qr_code_url);
      console.log("QR code generated:", qrCode);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <label htmlFor="content">QR Code Content (URL or text)</label>
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

      {qrCodeImage && (
        <div className={styles.qrCodeDisplay}>
          <img
            src={qrCodeImage}
            alt="Generated QR Code"
            className={styles.qrImage}
          />
          <div className={styles.downloadSection}>
            <a
              href={qrCodeImage}
              download="qrcode.png"
              className={styles.downloadButton}
            >
              Download QR Code
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
