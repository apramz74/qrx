import React, { useState, useEffect } from "react";
import styles from "./Analytics.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";
import { fetchAnalyticsData, fetchQRCodes } from "../api/analytics";

import { supabase } from "../supabaseClient";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [selectedQRCode, setSelectedQRCode] = useState("");
  const [dateRange, setDateRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [qrCodes, setQRCodes] = useState([]);
  const [error, setError] = useState(null);
  const [qrCodeImage, setQRCodeImage] = useState(null);

  useEffect(() => {
    fetchQRCodes()
      .then(setQRCodes)
      .catch((err) => {
        console.error("Error fetching QR codes:", err);
        setError("Failed to fetch QR codes");
      });
  }, []);

  useEffect(() => {
    if (selectedQRCode) {
      fetchAnalyticsData(selectedQRCode, dateRange)
        .then(setAnalyticsData)
        .catch((err) => {
          console.error("Error fetching analytics data:", err);
          setError("Failed to fetch analytics data");
        });
    }
  }, [selectedQRCode, dateRange]);

  useEffect(() => {
    if (selectedQRCode) {
      supabase
        .from("qr_codes")
        .select("qr_code_url")
        .eq("id", selectedQRCode)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          setQRCodeImage(data.qr_code_url);
        })
        .catch((err) => {
          console.error("Error fetching QR code data:", err);
          setError("Failed to fetch QR code data");
        });
    } else {
      setQRCodeImage(null);
    }
  }, [selectedQRCode]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2>QR Code Analytics</h2>

      <div className={styles.filters}>
        <select
          value={selectedQRCode}
          onChange={(e) => setSelectedQRCode(e.target.value)}
        >
          <option value="">Select a QR Code</option>
          {qrCodes.map((qrCode) => (
            <option key={qrCode.id} value={qrCode.id}>
              {qrCode.content || qrCode.id}
            </option>
          ))}
        </select>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {analyticsData && (
        <>
          <div className={styles.qrCodeDisplay}>
            <h3>Selected QR Code</h3>
            {qrCodeImage ? (
              <img
                src={qrCodeImage}
                alt="Selected QR Code"
                className={styles.qrCodeImage}
              />
            ) : (
              <p>No QR code selected</p>
            )}
          </div>

          <div className={styles.totalScans}>
            <h3>Total Scans</h3>
            <p>{analyticsData.totalScans}</p>
          </div>

          <div className={styles.scansOverTime}>
            <h3>Scans Over Time</h3>
            <Line data={analyticsData.scansOverTime} />
          </div>

          <div className={styles.deviceTypes}>
            <h3>Device Types</h3>
            <Pie data={analyticsData.deviceTypes} />
          </div>

          <div className={styles.topLocations}>
            <h3>Top Locations</h3>
            <Bar data={analyticsData.topLocations} />
          </div>

          <button
            className={styles.exportButton}
            onClick={() => exportData(analyticsData)}
          >
            Export Data
          </button>
        </>
      )}
    </div>
  );
};

const exportData = (data) => {
  // Implement export functionality here
  console.log("Exporting data:", data);
};

export default Analytics;
