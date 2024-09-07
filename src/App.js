import React, { useState } from "react";
import QRCodeGenerator from "./components/QRCodeGenerator";
import Analytics from "./components/Analytics";
import styles from "./App.module.css";

const App = () => {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <div className={styles.app}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${
            activeTab === "generate" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("generate")}
        >
          Generate QR Code
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "analytics" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
      </div>
      {activeTab === "generate" ? <QRCodeGenerator /> : <Analytics />}
    </div>
  );
};

export default App;
