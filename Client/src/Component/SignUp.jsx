import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import '../style/SignUp.css';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { AppContext } from "../AppContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './footer';

export default function SignUp() {
  const { isLoggedin } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const curr = await isLoggedin();
      if (curr) {
        toast.warn("You are already logged in");
        navigate('/profile');
        return;
      }
    }
    fetchData();
  }, [isLoggedin, navigate]);

  const styles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
      '& input': {
        color: 'white',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'white',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white',
    },
  };

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        withCredentials: true,
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!result.ok) {
        toast.error(result.message);
        console.error(result.message);
        return;
      } else {
        toast.success(result.message);
        navigate('/verifyEmail');
        return;
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error:', error);
      return;
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup flex flex-col items-center justify-center min-h-screen  text-gray-100 py-10 px-4">
        <ToastContainer />
        <div className="bg-blue-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign Up and Start Learning</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              id="username"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              sx={styles}
              className="w-full"
              placeholder="Enter your username"
            />
            <TextField
              id="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              sx={styles}
              className="w-full"
              placeholder="Enter your email"
            />
            <TextField
              id="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              variant="outlined"
              sx={styles}
              className="w-full"
              placeholder="Enter your password"
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              className="w-full py-2 mt-4"
            >
              Sign Up
            </Button>
            <p className="text-center text-gray-400 mt-4">
              Already have an account? <NavLink to="/login" className="text-blue-400 hover:underline">Log in</NavLink>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
