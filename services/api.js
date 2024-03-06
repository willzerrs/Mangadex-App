import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
// import { useQuery } from 'react-query';


const API_BASE_URL = 'https://api.mangadex.org';
const AUTH_URL = 'https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token'

// Authentication
const creds = {
    username: 'Willame',
    password: '@40!eKW65Zfn',
    client_id: 'personal-client-92841ab6-7ab1-4c3d-842a-4591e5046984-eb1b7f86',
    client_secret: 'CbwBtwXZLgNtUrP55NObbl16PpIOw9P0',
};

const authUser = async () => {
    try {
        const resp = await axios({
            method: 'POST',
            url: AUTH_URL,
            data: {
                grant_type: "password",
                username: creds.username,
                password: creds.password,
                client_id: creds.client_id,
                client_secret: creds.client_secret
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const { access_token, refresh_token } = resp.data;

        // Store the tokens
        setToken("accessToken", access_token)
        setToken("refreshToken", refresh_token)

        return { access_token, refresh_token };
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}

const refreshAccessToken = async () => {
    try {
        const resp = await axios({
            method: 'POST',
            url: AUTH_URL,
            data: {
                grant_type: "refresh_token",
                refresh_token: await getToken("refreshToken"),
                client_id: creds.client_id,
                client_secret: creds.client_secret
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const { access_token, refresh_token } = resp.data;
        setToken("accessToken", access_token)
        setToken("refreshToken", refresh_token)
        return { access_token, refresh_token };
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
};

const setToken = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
}

const getToken = async (key) => {
    let result = await SecureStore.getItemAsync(key)
    if (result) {
        return result
    } else {
        return console.error('Error fetching token: No values stored under that key.')
    }
}

// GET manga search
// TO-DO:
// - Accept parameters for user preferences
//      - Genre
//      - Rating (safe, suggestive, erotica, pornographic)
const searchMangas = async (titleQuery) => {
    try {
        const resp = await axios({
            method: 'GET',
            url: API_BASE_URL + '/manga',
            params: {
                title: titleQuery,
                limit: 20,
                contentRating: ['safe', 'suggestive', 'erotica', 'pornographic'],
                includes: ['cover_art', 'author'],
                order: { relevance: 'desc' },
            }
        })

        return resp;
    } catch (error) {
        console.error('Error fetching manga search:', error);
        throw error;
    }
}

/* 
    GET manga/{id}:
    - Title and alt titles
    - Description
    - Status (Ongoing/Finished)
    - Content Rating (Safe, Suggestive, Erotica, Pornographic)
    - Tags (Genre)
    - Author/Artist/Cover Art
*/
// TO-DO:
// - Accept parameters for user preferences
//      - language
const getMangaById = async (mangaId) => {
    try {
        const resp = await axios({
            method: 'GET',
            url: API_BASE_URL + `/manga/${mangaId}`,
            params: {
                includes: ["author", "cover_art"],
            }
        })

        return resp;
    } catch (error) {
        console.error('Error fetching manga details from MangaDex API:', error);
        throw error;
    }
}

/*
    GET manga/{id}/feed:
    - Manga volumes and chapters

    TO-DO:
    - Accept parameters for user preferences
        - Chapter descending/ascending
        - Language
*/

const getMangaFeed = async (mangaId) => {
    try {
        const resp = await axios({
            method: 'GET',
            url: API_BASE_URL + `/manga/${mangaId}/feed`,
            params: {
                translatedLanguage: ['en'],
                limit: 96,
                includes: ['scanlation_group', 'user'],
                order: {
                    volume: 'desc',
                    chapter: 'desc',
                },
                offset: 0,
                contentRating: ['safe', 'suggestive', 'erotica', 'pornographic']
            }
        })

        return resp;
    } catch (error) {
        console.error('Error fetching manga feed:', error);
        throw error;
    }
}

export { authUser, refreshAccessToken, setToken, getToken, searchMangas, 
    getMangaById, getMangaFeed };