import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import '../style/SignUp.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { AppContext } from "../AppContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './footer';

export default function VerifyEmail() {
  const location = useLocation();
  const { getEmail } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const result = await getEmail();
      if (result.ok) {
        toast.success(result.message);
        setEmail(result.data);
      } else {
        toast.error(result.message);
        if (result.redirect) {
          navigate(result.redirect);
        } else {
          navigate('/signup');
        }
      }
    }
    fetchData().catch((e) => {
      console.error('Error:', e);
      toast.error("Something went wrong");
    });
  }, [location, getEmail, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/user/verifyEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        withCredentials: true,
        body: JSON.stringify({ otp }),
      });
      const result = await response.json();
      if (result.ok) {
        toast.success(result.message);
        navigate('/profile');
      } else {
        toast.error(result.message);
        if (result.redirect) {
          navigate(result.redirect);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <Navbar />
      <div className="verify-email flex flex-col items-center justify-center min-h-screen text-gray-100 py-10 px-4">
        <ToastContainer />
        <div className="bg-blue-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {email && (
              <TextField
                id="email"
                label="Registered Email"
                defaultValue={email}
                sx={styles}
                InputProps={{ readOnly: true }}
                className="w-full"
              />
            )}
            <TextField
              id="otp"
              label="OTP"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              variant="outlined"
              sx={styles}
              className="w-full"
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              className="w-full py-2 mt-4"
            >
              Verify
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
