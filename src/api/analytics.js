// Mock data for demonstration purposes
const mockAnalyticsData = {
  totalScans: 1000,
  scansOverTime: {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Scans",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  },
  deviceTypes: {
    labels: ["Mobile", "Desktop", "Tablet"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  },
  topLocations: {
    labels: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
    datasets: [
      {
        label: "Scans",
        data: [120, 90, 70, 60, 50],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  },
};

export const fetchAnalyticsData = async (qrCodeId, dateRange) => {
  // In a real application, you would make an API call here
  // For now, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAnalyticsData);
    }, 500); // Simulate network delay
  });
};
