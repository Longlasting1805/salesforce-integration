const axios = require("axios");
const { getAccessToken } = require("../services/salesforceService");

let instanceUrl = null; // we will improve later

exports.createLead = async (req, res) => {
  try {
    const { accessToken, instanceUrl } = await getAccessToken();

    const response = await axios.post(
      `${instanceUrl}/services/data/v58.0/sobjects/Lead`,
      {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Company: req.body.company,
        Email: req.body.email,
        Phone: req.body.phone
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      id: response.data.id
    });

  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const { accessToken, instanceUrl } = await getAccessToken();

    await axios.patch(
      `${instanceUrl}/services/data/v58.0/sobjects/Lead/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      message: "Lead updated successfully"
    });

  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
};

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

exports.deleteLead = async (req, res) => {
  try {
    const { accessToken, instanceUrl } = await getAccessToken();

    await axios.delete(
      `${instanceUrl}/services/data/v58.0/sobjects/Lead/${req.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.json({
      success: true,
      message: "Lead deleted successfully"
    });

  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
};