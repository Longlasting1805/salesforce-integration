const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  accessToken: String,
  refreshToken: String,
  instanceUrl: String
});

module.exports = mongoose.model("Token", tokenSchema);