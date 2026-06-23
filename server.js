const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// =======================
// TOKEN STORAGE
// =======================
const TOKEN_FILE = "./tokens.json";

let accessToken = null;
let refreshToken = null;
let instanceUrl = null;

// =======================
// LOAD TOKENS ON START
// =======================
if (fs.existsSync(TOKEN_FILE)) {
  const data = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8"));

  accessToken = data.accessToken;
  refreshToken = data.refreshToken;
  instanceUrl = data.instanceUrl;

  console.log("✅ Tokens loaded from file");
}

// =======================
// HOME ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("Salesforce Integration Server Running...");
});

// =======================
// LOGIN ROUTE (NEW - NO MORE MANUAL EXCHANGE)
// =======================
app.get("/login", (req, res) => {
  const url =
    `${process.env.SF_LOGIN_URL}/services/oauth2/authorize` +
    `?response_type=code` +
    `&client_id=${process.env.SF_CLIENT_ID}` +
    `&redirect_uri=http://localhost:3000/callback`;

  res.redirect(url);
});

// =======================
// CALLBACK (AUTO LOGIN COMPLETE)
// =======================
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const params = new URLSearchParams();

    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.SF_CLIENT_ID);
    params.append("client_secret", process.env.SF_CLIENT_SECRET);
    params.append("redirect_uri", "http://localhost:3000/callback");
    params.append("code", code);

    const response = await axios.post(
      `${process.env.SF_LOGIN_URL}/services/oauth2/token`,
      params
    );

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    instanceUrl = response.data.instance_url;

    // SAVE TOKENS
    fs.writeFileSync(
      TOKEN_FILE,
      JSON.stringify({ accessToken, refreshToken, instanceUrl }, null, 2)
    );

    console.log("✅ Login successful + tokens saved");

    // send user back to frontend
    res.redirect("http://localhost:5173");

  } catch (error) {
    res.status(500).send(error.response?.data || error.message);
  }
});

// =======================
// REFRESH TOKEN FUNCTION
// =======================
async function getAccessToken() {
  try {
    const params = new URLSearchParams();

    params.append("grant_type", "refresh_token");
    params.append("client_id", process.env.SF_CLIENT_ID);
    params.append("client_secret", process.env.SF_CLIENT_SECRET);
    params.append("refresh_token", refreshToken);

    const response = await axios.post(
      `${process.env.SF_LOGIN_URL}/services/oauth2/token`,
      params
    );

    accessToken = response.data.access_token;

    return accessToken;

  } catch (error) {
    console.log("Refresh token error:", error.response?.data || error.message);
    throw error;
  }
}

// =======================
// CREATE LEAD
// =======================
app.post("/create-lead", async (req, res) => {
  try {
    const token = await getAccessToken();

    const leadData = {
      FirstName: req.body.firstName,
      LastName: req.body.lastName,
      Company: req.body.company,
      Email: req.body.email,
      Phone: req.body.phone,
      Status: "Open - Not Contacted"
    };

    const response = await axios.post(
      `${instanceUrl}/services/data/v58.0/sobjects/Lead/`,
      leadData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      id: response.data.id
    });

  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

// =======================
// GET LEADS
// =======================
app.get("/leads", async (req, res) => {
  try {
    const token = await getAccessToken();

    const query =
      "SELECT Id, FirstName, LastName, Company, Email, Phone FROM Lead LIMIT 50";

    const response = await axios.get(
      `${instanceUrl}/services/data/v58.0/query/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json({
      success: true,
      records: response.data.records
    });

  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

// =======================
// UPDATE LEAD
// =======================
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

    res.json({
      success: true,
      message: "Lead updated"
    });

  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

// =======================
// DELETE LEAD
// =======================
app.delete("/delete-lead/:id", async (req, res) => {
  try {
    const token = await getAccessToken();

    await axios.delete(
      `${instanceUrl}/services/data/v58.0/sobjects/Lead/${req.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json({
      success: true,
      message: "Lead deleted"
    });

  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

// =======================
// START SERVER
// =======================
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});