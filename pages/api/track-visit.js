import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  console.log("Received request:", req.method, req.url);
  console.log("Query parameters:", req.query);

  if (req.method === "GET") {
    const { qr_code_id, redirect_url } = req.query;

    if (!qr_code_id || !redirect_url) {
      console.error("Missing required parameters");
      return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
      console.log("Attempting to record visit");
      const { data, error } = await supabase.from("qr_code_visits").insert({
        qr_code_id,
        device_type: req.headers["user-agent"],
        location: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      console.log("Visit recorded successfully:", data);

      // Redirect to the original URL
      console.log("Redirecting to:", decodeURIComponent(redirect_url));
      res.redirect(301, decodeURIComponent(redirect_url));
    } catch (error) {
      console.error("Error recording visit:", error);
      console.log("Redirecting to:", decodeURIComponent(redirect_url));
      res.redirect(301, decodeURIComponent(redirect_url));
    }
  } else {
    console.log("Method not allowed:", req.method);
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
