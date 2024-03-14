import { Client } from "@microsoft/microsoft-graph-client";
import axios from 'axios';

const clientId = "f53af80f-b2d8-4583-ac80-4ada92b7caac";
const tenantId = "a205eb16-686e-46c3-8616-c13f03c58e59";
const clientSecret = "FoT8Q~7wkxpxCIb41hU3i-hFItObHKY4nMwBKbxR";

let accessToken = '';
let accessTokenExpiresAt = 0;

const client = Client.init({
  authProvider: async (done) => {
    const now = Date.now();

    // If the access token is expired or about to expire, refresh it
    if (!accessToken || now >= accessTokenExpiresAt - 5 * 60 * 1000) { // 5 minutes before expiration
      const tokenResponse = await getAccessToken(clientId, tenantId, clientSecret);
      accessToken = tokenResponse.access_token;
      accessTokenExpiresAt = now + tokenResponse.expires_in * 1000;
    }

    done(null, accessToken);
  },
});

async function getAccessToken(clientId: string, tenantId: string, clientSecret: string) {
    const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  
    const data = `client_id=${clientId}&scope=https://graph.microsoft.com/.default&client_secret=${encodeURIComponent(clientSecret)}&grant_type=client_credentials`;
  
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  
    return response.data;
}

export default client;