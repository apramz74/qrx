import { supabase } from "../supabaseClient";

export const fetchQRCodes = async () => {
  try {
    const { data, error } = await supabase
      .from("qr_codes")
      .select("id, content");
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    return [];
  }
};

export const fetchAnalyticsData = async (qrCodeId, dateRange) => {
  try {
    const { data, error } = await supabase
      .from("qr_code_visits")
      .select("*")
      .eq("qr_code_id", qrCodeId)
      .gte("visited_at", getStartDate(dateRange));

    if (error) throw error;
    return processAnalyticsData(data || []);
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return {
      totalScans: 0,
      scansOverTime: { labels: [], datasets: [] },
      deviceTypes: { labels: [], datasets: [] },
      topLocations: { labels: [], datasets: [] },
    };
  }
};

const getStartDate = (dateRange) => {
  const now = new Date();
  switch (dateRange) {
    case "7d":
      return new Date(now.setDate(now.getDate() - 7)).toISOString();
    case "30d":
      return new Date(now.setDate(now.getDate() - 30)).toISOString();
    case "90d":
      return new Date(now.setDate(now.getDate() - 90)).toISOString();
    default:
      return new Date(now.setDate(now.getDate() - 7)).toISOString();
  }
};

const processAnalyticsData = (data) => {
  const totalScans = data.length;
  const scansOverTime = processScansOverTime(data);
  const deviceTypes = processDeviceTypes(data);
  const topLocations = processTopLocations(data);

  return {
    totalScans,
    scansOverTime,
    deviceTypes,
    topLocations,
  };
};

const processScansOverTime = (data) => {
  const scans = data.reduce((acc, visit) => {
    const date = new Date(visit.visited_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(scans),
    datasets: [
      {
        label: "Scans",
        data: Object.values(scans),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
};

const processDeviceTypes = (data) => {
  const devices = data.reduce((acc, visit) => {
    const device = visit.device_type.split(" ")[0];
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(devices),
    datasets: [
      {
        data: Object.values(devices),
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  };
};

const processTopLocations = (data) => {
  const locations = data.reduce((acc, visit) => {
    acc[visit.location] = (acc[visit.location] || 0) + 1;
    return acc;
  }, {});

  const sortedLocations = Object.entries(locations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    labels: sortedLocations.map(([location]) => location),
    datasets: [
      {
        label: "Scans",
        data: sortedLocations.map(([, count]) => count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };
};
