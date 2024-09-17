import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import GridLoader from "react-spinners/GridLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./Navbar";
import Footer from "./footer";
import Button from '@mui/material/Button';
import NODP from '../assets/noDP.png';
const override = {
    display: "block",
    margin: "20% auto",
    borderColor: "red",
};

export default function Profile() {
    const { username } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true); // Add a loading state

    useEffect(() => {
        const url = (username && username.length > 0) 
            ? `${import.meta.env.VITE_URL}/api/user/profile/${username}` 
            : `${import.meta.env.VITE_URL}/api/user/profile/dashboard`;
        
        async function fetchData() {
            setLoading(true); // Set loading to true before fetching data
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "include",
                    withCredentials: true,
                });
                const result = await response.json();
                if (result.ok) {
                    setData(result.data);
                } else {
                    toast.error(result.message);
                    if (result.redirect) {
                        navigate(result.redirect);
                    } else {
                        navigate('/login');
                    }
                }
            } catch (e) {
                console.error(e);
                toast.error('An error occurred while fetching data');
                navigate('/');
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        }

        fetchData();
    }, [username, location.pathname]);

    if (loading) {
        return (
            <GridLoader
                color={'#0059ef'}
                loading={true}
                cssOverride={override}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        );
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-900 min-h-screen text-gray-100 p-8">
                {data ? (
                    data.isComplete ? (
                        // Render student profile when profile is complete
                        <div className="profile flex flex-col md:flex-row items-center md:items-start">
                            <div className="flex-none">
                                <img src={data.profile.dp} alt="Profile" className="w-64 h-64 rounded-md border-4 border-blue-600" />
                                <div className="mt-4 flex flex-col space-y-2">
                                    <a href={data.profile.links.website} target="_blank" rel="noopener noreferrer">
                                        <Button variant="contained" className="bg-blue-600 text-gray-100 hover:bg-blue-700 w-full">
                                            <i className="fa-solid fa-link mr-2"></i> Website
                                        </Button>
                                    </a>
                                    <a href={data.profile.links.twitter} target="_blank" rel="noopener noreferrer">
                                        <Button variant="contained" className="bg-blue-600 text-gray-100 hover:bg-blue-700 w-full">
                                            <i className="fa-brands fa-x-twitter mr-2"></i> Twitter
                                        </Button>
                                    </a>
                                    <a href={data.profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Button variant="contained" className="bg-blue-600 text-gray-100 hover:bg-blue-700 w-full">
                                            <i className="fa-brands fa-linkedin mr-2"></i> LinkedIn
                                        </Button>
                                    </a>
                                </div>
                            </div>
                            <div className="details md:w-2/3 mt-8 md:mt-0 md:ml-8">
                                <h1 className="text-5xl font-semibold my-4">{data.profile.fullname}</h1>
                                <h2 className="text-3xl font-semibold my-2">About Me</h2>
                                <p className="text-xl text-gray-300">{data.profile.about}</p>
                            </div>
                        </div>
                    ) : (
                        // Render basic profile when profile is not complete
                        <div className="profile flex flex-col md:flex-row items-center md:items-start">
                            <div className="links flex flex-col items-center md:w-1/3">
                                <img 
                                    src={NODP} 
                                    alt="Profile Avatar"
                                    className="w-60 h-60 rounded-full border-4 border-blue-600 mb-6"
                                />
                            </div>
                            <div className="details md:w-2/3 mt-8 md:mt-0 md:ml-8 text-center md:text-left">
                                <h1 className="text-5xl font-semibold my-4">{data.username}</h1>
                                <h2 className="text-3xl font-semibold my-2">About Me</h2>
                                <p className="text-xl text-gray-300">--</p>
                            </div>
                        </div>
                    )
                ) : (
                    <GridLoader
                        color={'#0059ef'}
                        loading={true}
                        cssOverride={override}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                )}
            </div>
            <Footer />
            <ToastContainer />
        </>
    );
}
