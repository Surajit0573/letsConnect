import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GridLoader from "react-spinners/GridLoader";
import Card from './Card';

const override = {
    display: "block",
    margin: "20% auto",
    borderColor: "red",
};

export default function Content() {
    const location = useLocation();
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const [filteredData, setFilteredData] = useState([]); // State for filtered users
    const [loading, setLoading] = useState(true); // Add a loading state

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                let url = `${import.meta.env.VITE_URL}/api/user/getAllUser`;
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: "include",
                    withCredentials: true,
                });
                const result = await response.json();
                console.log(result);
                if (result.ok) {
                    setData(result.data);
                    setFilteredData(result.data); // Initially, set filteredData to all users
                } else {
                    if (result.redirect) {
                        navigate(result.redirect);
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        }
        fetchData();
    }, [location, navigate]);

    // Function to handle search
    const handleSearch = () => {
        const filtered = data.filter((user) => {
            // Safely check if profile exists before accessing fullname
            const fullname = user.profile ? user.profile.fullname.toLowerCase() : '';
            const username = user.username.toLowerCase();
            const searchValue = searchTerm.toLowerCase();

            return fullname.includes(searchValue) || username.includes(searchValue);
        });
        setFilteredData(filtered);
    };

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
        <div className="flex flex-col text-left h-[70vh] w-[100vw] overflow-y-scroll bg-gray-900 text-gray-100 p-4 rounded-md shadow-md">
            {/* Header and Search Section */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-semibold">All Users</h1>
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="p-2 border rounded-lg mr-2 bg-gray-800 text-gray-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
                    />
                    <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                        onClick={handleSearch} // Trigger search when clicking the button
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Display Users */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData && filteredData.length > 0 ? (
                    filteredData.map((d, index) => (
                        <Card key={index} data={d} />
                    ))
                ) : (
                    <p>No users found</p> // Display if no users match the search
                )}
            </div>
        </div>
    );
}
