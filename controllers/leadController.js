const axios = require("axios");
const { getAccessToken } = require("../services/salesforceService");

let instanceUrl = null; // we will improve later

exports.getLeads = async (req, res) => {
  try {
    const token = await getAccessToken();

    const query =
      "SELECT Id, FirstName, LastName, Company, Email, Phone FROM Lead LIMIT 50";

    const response = await axios.get(
      `${process.env.SF_LOGIN_URL}/services/data/v58.0/query/?q=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    res.json({ success: true, records: response.data.records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};