import React, { useState, useEffect } from "react";
import styles from "./Analytics.module.css";
import { Line, Pie, Bar } from "react-chartjs-2";
import { fetchAnalyticsData } from "../api/analytics"; // Assume this function exists

const Analytics = () => {
  const [selectedQRCode, setSelectedQRCode] = useState("");
  const [dateRange, setDateRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    if (selectedQRCode) {
      fetchAnalyticsData(selectedQRCode, dateRange).then(setAnalyticsData);
    }
  }, [selectedQRCode, dateRange]);

  return (
    <div className={styles.container}>
      <h2>QR Code Analytics</h2>

      <div className={styles.filters}>
        <select
          value={selectedQRCode}
          onChange={(e) => setSelectedQRCode(e.target.value)}
        >
          <option value="">Select a QR Code</option>
          {/* Add QR code options here */}
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
