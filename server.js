const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const fs = require("fs");

const TOKEN_FILE = "./tokens.json";

// =======================
// GLOBAL AUTH STORAGE
// =======================
let accessToken = null;
let refreshToken = null;
let instanceUrl = null;

// LOAD TOKENS FROM FILE ON START
if (fs.existsSync(TOKEN_FILE)) {
    const data = JSON.parse(fs.readFileSync(TOKEN_FILE));

    accessToken = data.accessToken;
    refreshToken = data.refreshToken;
    instanceUrl = data.instanceUrl;

    console.log("✅ Tokens loaded from file");
}

// =======================
// HOME ROUTE
// =======================
app.get("/", (req, res) => {
    res.send("Salesforce Integration Server is running...");
});

// =======================
// OAUTH CALLBACK (optional debug)
// =======================
app.get("/callback", (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.send("No authorization code received");
    }

    console.log("AUTH CODE:", code);

    res.send(`
    <h2>Authorization Code Received ✅</h2>
    <p>${code}</p>
  `);
});

// =======================
// EXCHANGE AUTH CODE → TOKENS
// =======================
app.get("/exchange", async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json({
            error: "Missing authorization code"
        });
    }

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

        // SAVE TO FILE (THIS FIXES YOUR ISSUE)
        fs.writeFileSync(
            TOKEN_FILE,
            JSON.stringify({
                accessToken,
                refreshToken,
                instanceUrl
            })
        );

        console.log("✅ Tokens saved to file");

         res.json({
            message: "OAuth successful",
            accessToken,
            instanceUrl,
            refreshToken
        });
        return;

    } catch (error) {
        res.status(500).json({
            error: error.response?.data || error.message
        });
    }
});

// =======================
// GET NEW ACCESS TOKEN (REFRESH FLOW)
// =======================
async function getAccessToken() {
    console.log("Current refresh token:", refreshToken);
    console.log("Current instance URL:", instanceUrl);
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
// CREATE LEAD (NO MANUAL TOKEN NEEDED)
// =======================
app.post("/create-lead", async (req, res) => {
    try {
        if (!refreshToken || !instanceUrl) {
            return res.status(400).json({
                error: "Not authenticated. Run /exchange first."
            });
        }

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

app.patch("/update-lead/:id", async (req, res) => {
    try {
        const token = await getAccessToken();

        const leadId = req.params.id;

        const updateData = req.body;

        const response = await axios.patch(
            `${instanceUrl}/services/data/v58.0/sobjects/Lead/${leadId}`,
            updateData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({
            success: true,
            message: "Lead updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.response?.data || error.message
        });
    }
});

app.delete("/delete-lead/:id", async (req, res) => {
    try {
        const token = await getAccessToken();

        const leadId = req.params.id;

        await axios.delete(
            `${instanceUrl}/services/data/v58.0/sobjects/Lead/${leadId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        res.json({
            success: true,
            message: "Lead deleted successfully"
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