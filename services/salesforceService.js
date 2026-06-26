const axios = require("axios");
const Token = require("../models/Token");

let instanceUrl = null;

async function getAccessToken() {
  const tokenDoc = await Token.findOne();

  if (!tokenDoc) throw new Error("No token found");

  const params = new URLSearchParams();

  params.append("grant_type", "refresh_token");
  params.append("client_id", process.env.SF_CLIENT_ID);
  params.append("client_secret", process.env.SF_CLIENT_SECRET);
  params.append("refresh_token", tokenDoc.refreshToken);

  const res = await axios.post(
    `${process.env.SF_LOGIN_URL}/services/oauth2/token`,
    params
  );

 await Token.updateOne(
  {},
  {
    accessToken: res.data.access_token,
    instanceUrl: tokenDoc.instanceUrl
  }
);

return {
  accessToken: res.data.access_token,
  instanceUrl: tokenDoc.instanceUrl
};

return {
  accessToken: res.data.access_token,
  instanceUrl: tokenDoc.instanceUrl
};}

module.exports = { getAccessToken };