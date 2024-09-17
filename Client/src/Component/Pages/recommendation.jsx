import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '../Home/Card';
import Navbar from '../Navbar';
import Footer from "../footer";
import { useNavigate } from 'react-router-dom';

export default function Recommendation() {
    const [friends, setFriends] = useState([]);
    const [sameInterestPeople, setSameInterestPeople] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchFriends() {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/api/user/recommendation`, {
                    credentials: 'include',
                    withCredentials: true,
                });
                const data = await response.json();
                if (!data.ok) {
                    toast.error('Failed to load friends');
                    if (data.redirect) {
                        navigate(data.redirect);
                    }
                } else {
                    setFriends(data.data); // Set friends in state
                }
            } catch (error) {
                toast.error('Something went wrong');
            }
        }

        async function fetchSameInterestPeople() {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/api/user/sameInterest`, {
                    credentials: 'include',
                    withCredentials: true,
                });
                const data = await response.json();
                if (!data.ok) {
                    toast.error('Failed to load people with same interest');
                } else {
                    setSameInterestPeople(data.data); // Set sameInterestPeople in state
                }
            } catch (error) {
                toast.error('Something went wrong');
            }
        }

        fetchFriends();
        fetchSameInterestPeople();
    }, [navigate]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-900 p-8">
                <h1 className="text-4xl text-white mb-8">People You May Know</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {friends.length > 0 ? (
                        friends.map((d, index) => (
                            <Card key={index} data={d} />
                        ))
                    ) : (
                        <p className="text-white text-xl">No friends found.</p>
                    )}
                </div>

                <h1 className="text-4xl text-white mt-16 mb-8">People With Same Interest</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sameInterestPeople.length > 0 ? (
                        sameInterestPeople.map((d, index) => (
                            <Card key={index} data={d} />
                        ))
                    ) : (
                        <p className="text-white text-xl">No people with the same interest found.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
