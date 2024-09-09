require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const trackVisitRouter = require("./trackVisit");

console.log("REACT_APP_SUPABASE_URL:", process.env.REACT_APP_SUPABASE_URL);
console.log(
  "SUPABASE_SERVICE_ROLE_KEY:",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", trackVisitRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
