const Token = require("../models/Token");

exports.login = async (req, res) => {
    try {
        const { email = "user", password = "" } = req.body || {};
        // We are using Salesforce token existence as authentication
        const tokenDoc = await Token.findOne();

        if (!tokenDoc) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated. No Salesforce token found."
            });
        }

        return res.json({
            success: true,
            message: "Login successful",
            user: {
                email: email || "user"
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};