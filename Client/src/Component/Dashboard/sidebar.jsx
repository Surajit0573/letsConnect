import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useCallback } from "react";
import { AppContext } from "../../AppContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import deleteAccountIcon from "../../assets/deleteAccount.png";
import profileIcon from "../../assets/profile.png";
import resetpasswordIcon from "../../assets/reset-password.png";

function SidebarItem({ to, icon, label, onClick, isDanger }) {
  return (
    <div
      className={`p-4 text-2xl flex items-center ${isDanger ? 'text-red-600 border-red-600 hover:bg-red-500 hover:text-black' : 'hover:bg-blue-500'} transition-colors duration-300`}
      onClick={onClick}
    >
      <NavLink to={to} className="flex items-center w-full">
        <img src={icon} className="w-8 md:w-10 mr-4" alt={label} />
        <span className="hidden md:inline">{label}</span>
      </NavLink>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();

  const deleteAccount = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}/api/user/`, {
          method: 'DELETE',
          credentials: "include",
        });
        const result = await response.json();
        if (result.ok) {
          toast.success("Your account has been deleted");
          navigate('/');
        } else {
          toast.error(result.message);
          if (result.redirect) {
            navigate(result.redirect);
          }
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.error('Error:', error);
      }
    }
  }, [navigate]);

  return (
    <div className="w-full lg:w-80 h-full bg-gray-800 flex flex-col justify-between text-left py-4 lg:py-6">
      <div className="flex flex-col">
        <SidebarItem to="/dashboard/" icon={profileIcon} label="Update Profile" />
      </div>
      <div>
        <SidebarItem to="/dashboard/account" icon={resetpasswordIcon} label="Change Password" />
        <SidebarItem
          icon={deleteAccountIcon}
          label="Delete Your Account"
          onClick={deleteAccount}
          isDanger
        />
      </div>
    </div>
  );
}
