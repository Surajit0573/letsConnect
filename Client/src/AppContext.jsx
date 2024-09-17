import { createContext, useState, useEffect } from "react";
import axios from 'axios';
export const AppContext = createContext();

export default function AppContextProvider({ children }) {
    async function isLoggedin() {
        const response = await fetch(`${import.meta.env.VITE_URL}/api/user/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            withCredentials: true,
        });
        const result = await response.json();
        return result.ok;
    }

    async function getEmail() {
        const response = await fetch(`${import.meta.env.VITE_URL}/api/user/getEmail`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            withCredentials: true,
        });
        const result = await response.json();
        return result;
    }


    function getFileType(mimeType) {
        if (typeof mimeType !== 'string') {
            throw new Error('Input must be a string');
        }

        const parts = mimeType.split('/');
        return parts[0];
    }
    async function getUrl(file) {
        if (file == null) {
            console.log("No File");
            return null;
        }
        const type = getFileType(file.type);
        const API = type == "video" ? `${import.meta.env.VITE_URL}/api/upload/video` : `${import.meta.env.VITE_URL}/api/upload/`;
        try {
            // Send the POST request with the file
            const response = await axios.post(API, { file }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response);
            return response.data.url;

        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    }

    async function deleteFile(url) {
        if (url != '') {
            // Extract the necessary part from the URL
            const urlSegments = url.split('/');
            const lastTwoSegments = urlSegments.slice(-2).join('/').split('.')[0];
            const type = lastTwoSegments.split('/')[0]; // "skillshare"
            const publicId = lastTwoSegments.split('/')[1]; // "hlsuokgvbogo3mp3o1ep"
            console.log("Details: ", url, urlSegments, lastTwoSegments, publicId, type);
            try {
                // Send the POST request with the file
                const response = await axios.post(`${import.meta.env.VITE_URL}/api/upload/delete`, { publicId, type });
                console.log(response);

            } catch (error) {
                console.error('Error deleteing file:', error);
            }
        }
    }



    const value = { getUrl, deleteFile, isLoggedin, getEmail };
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}