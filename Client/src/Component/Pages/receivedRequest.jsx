import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '../Home/Card';
import Navbar from '../Navbar';
import Footer from "../footer";
import { useNavigate } from 'react-router-dom';
export default function receivedRequest() {
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchFriends() {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/api/user/receivedRequests`, {
                    credentials: 'include',
                    withCredentials: true,
                });
                const data = await response.json();
                if (!data.ok) {
                    toast.error('Failed to load friends');
                    if(data.redirect){
                        navigate(data.redirect);
                     }
                } else {
                    setFriends(data.data); // Set friends in state
                }
            } catch (error) {
                toast.error('Something went wrong');
            }
        }
        fetchFriends();
    }, []);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-900 p-8">

                <h1 className="text-4xl text-white mb-8">Received Requests</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {friends.length > 0 ? (
                        friends.map((d, index) => (
                            <Card key={index} data={d} />
                        ))
                    ) : (
                        <p className="text-white text-xl">No friends found.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}