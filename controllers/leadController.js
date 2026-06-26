const axios = require("axios");
const { getAccessToken } = require("../services/salesforceService");

let instanceUrl = null; // we will improve later

exports.getLeads = async (req, res) => {
    try {
        const { accessToken, instanceUrl } = await getAccessToken();
        const query =
            "SELECT Id, FirstName, LastName, Company, Email, Phone FROM Lead LIMIT 50";

        const response = await axios.get(
            `${instanceUrl}/services/data/v58.0/query/?q=${encodeURIComponent(query)}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        res.json({ success: true, records: response.data.records });
    } catch (err) {
        console.error("Salesforce Error:", err.response?.data || err.message);

        res.status(500).json({
            error: err.response?.data || err.message
        });
    }
};