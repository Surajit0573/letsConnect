import Navbar from "../Navbar";
import Sidebar from "./sidebar";
import * as React from 'react';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../footer";

export default function DashBoard() {
    const navigate = useNavigate();
    const [pass, setPass] = useState({
        currPass: '',
        newPass: ''
    });
    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/api/user/changePass`, {
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
                    console.error(result.message);
                    if (result.redirect) {
                        navigate(result.redirect);
                    }
                }
                return;
            } catch (error) {
                console.error('Error:', error);
                return;
            }
        }

        fetchData();
    }, []);

    const styles = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#1f2937',
            },
            '&:hover fieldset': {
                borderColor: '#3b82f6',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#3b82f6',
            },
            '& input': {
                color: 'white',
            },
        },
        '& .MuiInputLabel-root': {
            color: '#9ca3af',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#3b82f6',
        },
        marginBottom: '20px',
        width: '70%',
    };

    function handleChange(e) {
        setPass({ ...pass, [e.target.name]: e.target.value });
    }

    async function handleSubmit() {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/user/changePass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                withCredentials: true,
                body: JSON.stringify(pass),
            });
            const result = await response.json();
            console.log(result.message);
            if (result.ok) {
                toast.success('Password changed successfully');
                return;
            } else {
                toast.error(result.message);
                console.error(result.message);
                if (result.redirect) {
                    navigate(result.redirect);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setPass({ currPass: '', newPass: '' });
    }

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100">
            <Navbar />
            <div className="h-[90vh] flex">
                <Sidebar />
                <div className="flex-grow p-8 flex items-center justify-center">
                    <div className="bg-gray-800 p-10 w-full max-w-md rounded-md">
                        <p className="text-2xl font-semibold mb-6 text-center">Change Your Password</p>
                        {data && (
                            <TextField
                                id="outlined-read-only-input"
                                label="User Name"
                                defaultValue={data}
                                sx={styles}
                                InputProps={{
                                    readOnly: true,
                                }}
                                className="mb-6"
                            />
                        )}
                        <TextField
                            id="outlined-basic"
                            label="Current Password"
                            name="currPass"
                            value={pass.currPass}
                            onChange={handleChange}
                            variant="outlined"
                            sx={styles}
                            required
                        />
                        <TextField
                            id="outlined-basic"
                            label="New Password"
                            name="newPass"
                            value={pass.newPass}
                            onChange={handleChange}
                            variant="outlined"
                            sx={styles}
                            required
                        />
                        <button
                            className="bg-blue-600 mt-6 w-full py-2 rounded-md text-xl hover:bg-blue-700 transition-colors"
                            onClick={handleSubmit}
                        >
                            Change
                        </button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
