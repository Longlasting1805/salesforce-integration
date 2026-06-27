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
        console.error("Status:", err.response?.status);
        console.error("Salesforce Response:", JSON.stringify(err.response?.data, null, 2));

        res.status(500).json({
            status: err.response?.status,
            salesforce: err.response?.data,
            message: err.message
        });
    }
};