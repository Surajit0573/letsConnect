import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import NODP from '../../assets/noDP.png';

export default function Card({ data }) {
    const [profilePicture, setProfilePicture] = useState(data?.profile?.dp);
    const [isFriend, setIsFriend] = useState(data?.isFriend); // Track friendship status
    const [isSent, setIsSent] = useState(data?.isSent); // Track if friend request is sent
    const [isReceived, setIsReceived] = useState(data?.isReceived); // Track if friend request is received
    const [mutualFriendsCount, setMutualFriendsCount] = useState(data?.mutualFriends?.length || 0); // Count of mutual friends
    const navigate = useNavigate();

    function viewProfileHandler() {
        // Navigate to the user's profile page based on their username
        navigate(`/profile/${data.username}`);
    }

    async function handleFriendAction() {
        if (isFriend) {
            // Unfriend logic here
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/api/user/unfriend`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ friendId: data._id })
                });
                const result = await response.json();
                if (result.ok) {
                    setIsFriend(false); // Update the state to reflect the unfriend action
                    console.log('Unfriended successfully');
                } else {
                    console.error('Failed to unfriend:', result.message);
                }
            } catch (error) {
                console.error('Error during unfriend:', error);
            }
        } else {
            // Add friend logic here
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/api/user/addFriend`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ friendId: data._id })
                });
                const result = await response.json();
                if (result.ok) {
                    setIsSent(true);  // Mark request as sent
                    console.log('Friend request sent successfully');
                } else {
                    console.error('Failed to send friend request:', result.message);
                }
            } catch (error) {
                console.error('Error sending friend request:', error);
            }
        }
    }

    async function handleConfirm() {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/user/confirmFriendRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ friendId: data._id })
            });
            const result = await response.json();
            if (result.ok) {
                setIsFriend(true); // Update the state to reflect the confirmed friend
                setIsReceived(false);  // Reset sent status
                console.log('Friend request confirmed');
            } else {
                console.error('Failed to confirm friend request:', result.message);
            }
        } catch (error) {
            console.error('Error confirming friend request:', error);
        }
    }

    async function handleReject() {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/user/rejectFriendRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ friendId: data._id })
            });
            const result = await response.json();
            if (result.ok) {
                setIsReceived(false); // Update state to reflect rejection
                console.log('Friend request rejected');
            } else {
                console.error('Failed to reject friend request:', result.message);
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    }

    async function handleWithdraw() {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/user/withdrawFriendRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ friendId: data._id })
            });
            const result = await response.json();
            if (result.ok) {
                setIsSent(false); // Remove the sent request state
                console.log('Friend request withdrawn successfully');
            } else {
                console.error('Failed to withdraw friend request:', result.message);
            }
        } catch (error) {
            console.error('Error withdrawing friend request:', error);
        }
    }

    return (
        <div className="bg-white text-black rounded-lg shadow-md overflow-hidden w-64">
            <div className="p-4 flex flex-col items-center">
                {profilePicture != null ? (
                    <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-24 h-24 rounded-full mb-4 object-cover"
                    />
                ) : (
                    <img
                        src={NODP}
                        alt="Profile"
                        className="w-24 h-24 rounded-full mb-4 object-cover"
                    />
                )}
                <h4 className="text-lg font-semibold mb-2 flex flex-col items-center">
                    {data && <span>{data.profile != null ? data.profile.fullname : data.username}</span>}
                    {mutualFriendsCount > 0 && (
                        <span className="text-gray-500 text-sm">({mutualFriendsCount} mutual friends)</span>
                    )}
                </h4>
                <div className="flex flex-col w-full space-y-2">
                    <button
                        className="bg-blue-600 text-white py-2 rounded-lg w-full"
                        onClick={viewProfileHandler}
                    >
                        View Profile
                    </button>
                    {isSent ? (
                        <button
                            className="bg-red-600 text-white py-2 rounded-lg w-full"
                            onClick={handleWithdraw}
                        >
                            Withdraw
                        </button>
                    ) : isReceived ? (
                        <>
                            <button
                                className="bg-green-600 text-white py-2 rounded-lg w-full"
                                onClick={handleConfirm}
                            >
                                Confirm
                            </button>
                            <button
                                className="bg-red-600 text-white py-2 rounded-lg w-full"
                                onClick={handleReject}
                            >
                                Reject
                            </button>
                        </>
                    ) : (
                        <button
                            className={`py-2 rounded-lg w-full ${isFriend ? 'bg-red-600 text-white' : 'bg-gray-300 text-black'}`}
                            onClick={handleFriendAction}
                        >
                            {isFriend ? 'Unfriend' : 'Add Friend'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
