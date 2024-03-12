import React from 'react';
import { FaChartBar, FaUser, FaUsers, FaList } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import {
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";

const Sidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const adminName = currentUser ? currentUser.username : "Admin";
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      // Remove access_token cookie upon successful sign-out
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    currentUser && (
      <div className="bg-slate-600 text-white h-[700px] w-60 overflow-y-hidden">
        <div className="p-4 border-b border-gray-700">
          <Link to="/profile" className="text-white font-semibold">
            <div className='flex items-center gap-5'>
              <FaUser className='mr-2'/>
              <span> {adminName}</span>
            </div>
          </Link>
        </div>
        <div className="p-4">
          <ul>
            <li>
              <Link
                to="/admin-dashboard"
                className={`block hover:bg-gray-700 px-2 py-1 rounded ${
                  location.pathname === "/admin-dashboard" ? "bg-gray-700" : ""
                }`}
              >
                <div className='flex items-center gap-4 font-semibold'>
                <FaChartBar className='mr-2'/>
                  <span>Dashboard</span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                to="/admin-dashboard/users"
                className={`block hover:bg-gray-700 px-2 py-1 rounded ${
                  location.pathname === "/admin-dashboard/users" ? "bg-gray-700" : ""
                }`}
              >
                <div className='flex items-center gap-5 font-semibold'>
                  <FaUsers />
                  Users
                </div>
                
              </Link>
            </li>

            <li>
              <Link
                to="/admin-dashboard/listings"
                className={`block hover:bg-gray-700 px-2 py-1 rounded ${
                  location.pathname === "/admin-dashboard/listings" ? "bg-gray-700" : ""
                }`}
              >
                <div className='flex items-center gap-5 font-semibold'>
                  <FaList />
                  Listings
                </div>
                
              </Link>
            </li>

            <li>
              <Link
                to="/admin-dashboard/messages-from-contact"
                className={`block hover:bg-gray-700 px-2 py-1 rounded ${
                  location.pathname === "/admin-dashboard/messages-from-contact" ? "bg-gray-700" : ""
                }`}
              >
                <div className='flex items-center gap-5 font-semibold'>
                  <FaMessage />
                  Messages From Contact
                </div>
                
              </Link>
            </li>

            <li>
              <Link
                onClick={handleSignOut}
                className="block text-white-200 hover:bg-gray-700 px-2 py-1 rounded"
              >
                Sign Out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  );
};

export default Sidebar;
