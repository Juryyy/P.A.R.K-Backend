import { Client } from "@microsoft/microsoft-graph-client";
import axios from 'axios';
import env from './env-config';

const clientId = env.getEnv('CLIENT_ID') as string;
const tenantId = env.getEnv('TENANT_ID') as string;
const clientSecret = env.getEnv('CLIENT_SECRET') as string;

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