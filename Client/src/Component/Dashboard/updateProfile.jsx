import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NODP from '../../assets/noDP.png';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function UpdateProfile() {
    const navigate = useNavigate();
    const [heading, setHeading] = useState("Complete Your Profile");
    const [profile, setProfile] = useState({
        fullname: '',
        about: '',
    });
    const [links, setLinks] = useState({
        website: '',
        linkedin: '',
        twitter: '',
    });
    const { getUrl, deleteFile } = useContext(AppContext);
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState(NODP);
    const [interests, setInterests] = useState([]);
    const [interest, setInterest] = useState('');

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/user/profile`, {
                method: 'GET',
                credentials: "include",
                withCredentials: true,
            });
            const result = await response.json();
            if (result.ok) {
                setProfile({
                    fullname: result.data.fullname,
                    about: result.data.about
                });
                setLinks({
                    website: result.data.links.website,
                    linkedin: result.data.links.linkedin,
                    twitter: result.data.links.twitter,
                });
                setInterests(result.data.interests || []);
                setUrl(result.data.dp);
                setHeading("Update Your Profile");
            } else {
                toast.error(result.message);
                if (result.redirect) {
                    navigate(result.redirect);
                }
            }
        }
        fetchData();
    }, []);

    const styles = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#555',
            },
            '&:hover fieldset': {
                borderColor: '#777',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#1f2937',
            },
            '& input': {
                color: '#fff',
            },
        },
        '& .MuiInputLabel-root': {
            color: '#bbb',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#fff',
        },
        marginBottom: '20px',
        '& .MuiOutlinedInput-input': {
            color: '#fff',
        },
        width: '100%',
        maxWidth: '600px',
    };

    useEffect(() => {
        async function update() {
            const currUrl = await getUrl(file);
            setUrl(currUrl);
        }
        if (file != null) {
            update();
        }
    }, [file]);

    function addInterest(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (interest.trim().length !== 0) {
                setInterests([...interests, interest.trim()]);
                setInterest('');
            }
        }
    }

    function deleteInterest(e) {
        setInterests(interests.filter((t) => t !== e.target.getAttribute('name')));
    }

    function handleChange(e) {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    }

    function handleLinkChange(e) {
        setLinks({ ...links, [e.target.name]: e.target.value });
    }

    async function handleFileChange(e) {
        setFile(e.target.files[0]);
        deleteFile(url);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/user/profile/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                withCredentials: true,
                body: JSON.stringify({ fullname: profile.fullname, about: profile.about, links, interests, dp: url })
            });
            const result = await response.json();
            if (result.ok) {
                navigate('/profile');
            } else {
                toast.error(result.message);
                if (result.redirect) {
                    navigate(result.redirect);
                }
            }
        } catch (error) {
            toast.error('Failed to update profile, try again later.');
        }
    }

    return (
        <>
            <div className="bg-gray-900 text-white p-8 min-h-screen flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-8">{heading}</h1>
                <div className="w-full max-w-2xl">
                    <div className='upload flex flex-col items-center mb-8'>
                        <img src={url} className="rounded-full object-cover w-40 h-40 mb-4" alt="Profile" />
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            name="dp"
                            onChange={handleFileChange}
                            sx={{ backgroundColor: '#1f2937', '&:hover': { backgroundColor: '#374151' } }}
                        >
                            Upload Profile Picture
                            <VisuallyHiddenInput type="file" />
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col items-center">
                        <TextField id="fullname" name="fullname" value={profile.fullname} onChange={handleChange} label='Full Name' variant="outlined" sx={styles} className='inputtext' required />
                        <TextField id="about" name="about" value={profile.about} onChange={handleChange} label="About Me" multiline rows={3} variant="outlined" sx={styles} className='inputtext' required />
                        <TextField id="interests" name="interests" value={interest} onChange={(e) => setInterest(e.target.value)} onKeyDown={addInterest} label='Add Interests' variant="outlined" sx={styles} className='inputtext' />
                        <div className="showTags flex flex-wrap mt-4 w-full">
                            {interests.map((t, index) => (
                                <div key={index} className="oneTag bg-blue-600 text-white px-3 py-1 rounded-full flex items-center mr-2 mb-2">
                                    {t}
                                    <button name={t} onClick={deleteInterest} className="ml-2">
                                        <i name={t} className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <TextField id="website" name="website" value={links.website} onChange={handleLinkChange} label='Website Link' variant="outlined" sx={styles} className='inputtext' />
                        <TextField id="twitter" name="twitter" value={links.twitter} onChange={handleLinkChange} label='Twitter Link' variant="outlined" sx={styles} className='inputtext' />
                        <TextField id="linkedin" name="linkedin" value={links.linkedin} onChange={handleLinkChange} label='LinkedIn Link' variant="outlined" sx={styles} className='inputtext' />
                        <Button type='submit' disabled={!((url !== '') && (interests.length > 0))} variant="contained" size="large" sx={{ backgroundColor: '#1f2937', marginTop: '30px', '&:hover': { backgroundColor: '#374151' } }}>
                            SAVE
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
