import axios from 'axios';
import axiosAuthRefresh from 'axios-auth-refresh';

const API_BASE_URL = 'https://api.mangadex.org';
const AUTH_URL = 'https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token';

const clientCredentials = {
    username: 'Willame',
    password: '@40!eKW65Zfn',
    clientId: 'personal-client-92841ab6-7ab1-4c3d-842a-4591e5046984-eb1b7f86',
    clientSecret: 'CbwBtwXZLgNtUrP55NObbl16PpIOw9P0',
};

let accessToken = null;
let refreshToken = null; // Variable to store the refresh token

const getAccessToken = async () => {
  const { username, password, clientId, clientSecret } = clientCredentials;
  const creds = {
    grant_type: 'password',
    username: username,
    password: password,
    client_id: clientId,
    client_secret: clientSecret,
  };

  try {
    const response = await axios.post(AUTH_URL, creds);
    const { access_token, refresh_token } = response.data;

    // Store the refresh token
    refreshToken = refresh_token;

    return access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
};

// Function to refresh the access token
const refreshAccessToken = async () => {
  accessToken = await getAccessToken();
  return accessToken;
};

// Configure axios with the access token
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Function to initialize the access token
const initializeAccessToken = async () => {
  accessToken = await getAccessToken();
};

// Initialize the access token
initializeAccessToken();

const fetchMangaList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/manga`);
    return response.data;
  } catch (error) {
    console.error('Error fetching manga list:', error);
    throw error;
  }
};

export { getAccessToken, fetchMangaList };
