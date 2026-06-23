const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

let accessToken = null;
let refreshToken = null;
let instanceUrl = null;

// ======================
// LOGIN START
// ======================
app.get("/login", (req, res) => {
  const url =
    `${process.env.SF_LOGIN_URL}/services/oauth2/authorize` +
    `?response_type=code` +
    `&client_id=${process.env.SF_CLIENT_ID}` +
    `&redirect_uri=${process.env.SF_REDIRECT_URI}`;

  res.redirect(url);
});

// ======================
// CALLBACK
// ======================
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) return res.redirect("http://localhost:5173/");

  try {
    const params = new URLSearchParams();

    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.SF_CLIENT_ID);
    params.append("client_secret", process.env.SF_CLIENT_SECRET);
    params.append("redirect_uri", process.env.SF_REDIRECT_URI);
    params.append("code", code);

    const response = await axios.post(
      `${process.env.SF_LOGIN_URL}/services/oauth2/token`,
      params
    );

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    instanceUrl = response.data.instance_url;

    return res.redirect("http://localhost:5173/dashboard");

  } catch (err) {
    return res.redirect("http://localhost:5173/");
  }
});

// ======================
// REFRESH TOKEN
// ======================
async function getAccessToken() {
  const params = new URLSearchParams();

  params.append("grant_type", "refresh_token");
  params.append("client_id", process.env.SF_CLIENT_ID);
  params.append("client_secret", process.env.SF_CLIENT_SECRET);
  params.append("refresh_token", refreshToken);

  const res = await axios.post(
    `${process.env.SF_LOGIN_URL}/services/oauth2/token`,
    params
  );

  accessToken = res.data.access_token;
  return accessToken;
}

// ======================
// CREATE LEAD
// ======================
app.post("/create-lead", async (req, res) => {
  try {
    const token = await getAccessToken();

    const lead = {
      FirstName: req.body.firstName,
      LastName: req.body.lastName,
      Company: req.body.company,
      Email: req.body.email,
      Phone: req.body.phone
    };

    const response = await axios.post(
      `${instanceUrl}/services/data/v58.0/sobjects/Lead/`,
      lead,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ success: true, id: response.data.id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================
// GET LEADS
// ======================
app.get("/leads", async (req, res) => {
  try {
    const token = await getAccessToken();

    const query =
      "SELECT Id, FirstName, LastName, Company, Email, Phone FROM Lead LIMIT 50";

    const response = await axios.get(
      `${instanceUrl}/services/data/v58.0/query/?q=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    res.json({ success: true, records: response.data.records });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================
// UPDATE LEAD
// ======================
app.patch("/update-lead/:id", async (req, res) => {
  try {
    const token = await getAccessToken();

    await axios.patch(
      `${instanceUrl}/services/data/v58.0/sobjects/Lead/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================
// DELETE LEAD
// ======================
app.delete("/delete-lead/:id", async (req, res) => {
  try {
    const token = await getAccessToken();

    await axios.delete(
      `${instanceUrl}/services/data/v58.0/sobjects/Lead/${req.params.id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});