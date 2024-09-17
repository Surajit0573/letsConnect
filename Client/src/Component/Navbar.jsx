import * as React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from "../AppContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NODP from '../assets/noDP.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedin } = useContext(AppContext);
  const [isLog, setIsLog] = useState(false);
  const [isTeacher, setTeacher] = useState(false);
  const [dp, setDp] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const curr = await isLoggedin();
      setIsLog(curr);
      if (curr) {
        const response = await fetch(`${import.meta.env.VITE_URL}/api/user/getInfo`, {
          credentials: 'include',
          withCredentials: true,
        });
        if (!response.ok) {
          toast.error('Failed to fetch user data');
        } else {
          const data = await response.json();
          setTeacher(data.isTeacher);
          setDp(data.dp);
        }
      }
    }
    fetchData();
  }, [location, isLoggedin]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/user/logout`, {
        credentials: "include",
        withCredentials: true,
      });
      if (!response.ok) {
        toast.error('Failed to logout');
      } else {
        setIsLog(false);
        toast.success('Logged out');
        navigate('/');
      }
    } catch (e) {
      toast.error('Failed to logout');
    }
  };

  async function handleClick() {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/user/signOutTeach`, {
        credentials: 'include',
        withCredentials: true,
      });
      const result = await response.json();
      if (!result.ok) {
        toast.error(result.message);
      } else {
        setTeacher(false);
        toast.success('You have successfully unregistered as a teacher');
      }
    } catch (e) {
      toast.error('Something went wrong');
    }
  }

  const buttonStyle = 'border p-2 px-4 rounded-md font-semibold transition-colors duration-300';
  const activeStyle = 'bg-blue-700 text-blue-100 border-blue-700';
  const defaultStyle = 'border-blue-600 hover:bg-blue-600 hover:text-blue-100';

  return (
    <>
      <ToastContainer />
      <div className='bg-blue-900 text-gray-100 flex items-center p-4 shadow-md relative'>
        {/* Hamburger Icon */}
        <div className="block lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-3xl">
            <i className={`fa ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        <div className='flex items-center flex-grow'>
          <NavLink to={"/"} className='flex items-center mx-4 text-3xl'>
            <i className="fa-brands fa-connectdevelop"></i>
            <h1 className='text-2xl ml-2 hidden sm:block'>Let's Connect</h1>
          </NavLink>
        </div>

        {/* Menu Items for Larger Screens */}
        <div className="hidden lg:flex lg:flex-wrap lg:space-x-4 lg:text-xl lg:justify-center flex-grow">
          <NavLink
            to="/friends"
            className={({ isActive }) =>
              isActive ? `${activeStyle} ${buttonStyle}` : `${defaultStyle} ${buttonStyle}`
            }
          >
            My Friends
          </NavLink>

          <NavLink
            to="/friend-requests"
            className={({ isActive }) =>
              isActive ? `${activeStyle} ${buttonStyle}` : `${defaultStyle} ${buttonStyle}`
            }
          >
            Friend Requests
          </NavLink>

          <NavLink
            to="/sent-requests"
            className={({ isActive }) =>
              isActive ? `${activeStyle} ${buttonStyle}` : `${defaultStyle} ${buttonStyle}`
            }
          >
            Sent Requests
          </NavLink>

          <NavLink
            to="/recommendations"
            className={({ isActive }) =>
              isActive ? `${activeStyle} ${buttonStyle}` : `${defaultStyle} ${buttonStyle}`
            }
          >
            Recommendations
          </NavLink>
        </div>

        {/* Profile and Sign In/Out Buttons */}
        <div className='flex items-center ml-auto'>
          {!isLog && 
            <NavLink to={"/login"}>
              <button className='bg-blue-800 text-gray-100 p-2 rounded-xl mx-2'>Sign In</button>
            </NavLink>
          }
          <img 
            src={dp ? dp : NODP} 
            className='h-12 w-12 rounded-full mx-2 cursor-pointer' 
            alt="Profile" 
            onClick={() => setClicked(prev => !prev)} 
          />
        </div>

        {clicked && 
          <div className='absolute top-16 right-5 bg-blue-800 text-gray-100 rounded-md shadow-lg z-10'>
            <NavLink to={'/profile'}>
              <p className={`${buttonStyle} ${defaultStyle} ${clicked ? activeStyle : ''}`}>My Profile</p>
            </NavLink>
            <NavLink to={'/dashboard'}>
              <p className={`${buttonStyle} ${defaultStyle} ${clicked ? activeStyle : ''}`}>Dashboard</p>
            </NavLink>
            {isTeacher && 
              <p className={`${buttonStyle} ${defaultStyle} ${clicked ? activeStyle : ''}`} onClick={handleClick}>
                Sign Out as Teacher
              </p>
            }
            {isLog ? 
              <p className={`${buttonStyle} ${defaultStyle} ${clicked ? activeStyle : ''}`} onClick={handleLogout}>
                Sign Out
              </p> : 
              <NavLink to={'/login'}>
                <p className={`${buttonStyle} ${defaultStyle} ${clicked ? activeStyle : ''}`}>Sign In</p>
              </NavLink>
            }
          </div>
        }
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed top-16 left-0 w-full bg-blue-800 text-gray-100 ${menuOpen ? 'block' : 'hidden'} z-20`}>
        <div className='flex flex-col items-center py-4'>
          <NavLink
            to="/friends"
            className={({ isActive }) =>
              isActive ? `${activeStyle} ${buttonStyle} w-full text-center` : `${defaultStyle} ${buttonStyle} w-full text-center`
            }
            onClick={() => setMenuOpen(false)}
          >
            My Friends
          </NavLink>

          <NavLink
            to="/friend-requests"
            className={({ isActive }) =>
              isActive ? `${activeStyle} ${buttonStyle} w-full text-center` : `${defaultStyle} ${buttonStyle} w-full text-center`
            }
            onClick={() => setMenuOpen(false)}
          >
            Friend Requests
          </NavLink>

          <NavLink
            to="/sent-requests"
            className={({ isActive }) =>
              isActive ? `${activeStyle} ${buttonStyle} w-full text-center` : `${defaultStyle} ${buttonStyle} w-full text-center`
            }
            onClick={() => setMenuOpen(false)}
          >
            Sent Requests
          </NavLink>

          <NavLink
            to="/recommendations"
            className={({ isActive }) =>
              isActive ? `${activeStyle} ${buttonStyle} w-full text-center` : `${defaultStyle} ${buttonStyle} w-full text-center`
            }
            onClick={() => setMenuOpen(false)}
          >
            Recommendations
          </NavLink>

          {!isLog && 
            <NavLink to={"/login"}>
              <button className='bg-blue-800 text-gray-100 p-2 rounded-xl mx-2 mt-4 w-full'>Sign In</button>
            </NavLink>
          }
          {isLog &&
            <button className='bg-blue-800 text-gray-100 p-2 rounded-xl mx-2 mt-4 w-full' onClick={handleLogout}>Sign Out</button>
          }
          {isTeacher && 
            <button className='bg-blue-800 text-gray-100 p-2 rounded-xl mx-2 mt-4 w-full' onClick={handleClick}>
              Sign Out as Teacher
            </button>
          }
        </div>
      </div>
    </>
  );
}
