const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("In trackVisit.js - REACT_APP_SUPABASE_URL:", supabaseUrl);
console.log(
  "In trackVisit.js - SUPABASE_SERVICE_ROLE_KEY:",
  supabaseServiceRoleKey
);

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

router.get("/track-visit", async (req, res) => {
  console.log("Received tracking request:", req.query);
  const { qr_code_id, redirect_url } = req.query;

  if (!qr_code_id || !redirect_url) {
    console.error("Missing required parameters");
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Record the visit
    const { data, error } = await supabase.from("qr_code_visits").insert({
      qr_code_id,
      device_type: req.headers["user-agent"],
      location: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    });

    if (error) {
      console.error("Error inserting visit:", error);
      throw error;
    }

    console.log("Visit recorded successfully:", data);

    // Redirect to the original URL
    res.redirect(301, decodeURIComponent(redirect_url));
  } catch (error) {
    console.error("Error recording visit:", error);
    res.redirect(301, decodeURIComponent(redirect_url));
  }
});

module.exports = router;
