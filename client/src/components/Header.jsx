import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
// import { MagicBellProvider } from "@magicbell/magicbell-react";
import { FaSearch, FaBell } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SiGooglemessages } from "react-icons/si";
import TawkChat from "./TwakChat";


export default function Header() {
 const { currentUser } = useSelector((state) => state.user);
 const location = useLocation();
 const navigate = useNavigate();
 const [searchTerm, setSearchTerm] = useState("");
 const [notifications, setNotifications] = useState([]);

 // Fetch new notifications from Magic Bell
//  useEffect(() => {
//   if (currentUser) {
//     fetch(`https://api.magicbell.io/v1/users/${currentUser.id}/notifications`, {
//       headers: {
//         'Authorization': `Bearer YOUR_MAGIC_BELL_API_KEY`,
//         'Content-Type': 'application/json',
//       },
//     })
//     .then(response => response.json())
//     .then(data => setNotifications(data.notifications))
//     .catch(error => console.error('Error fetching notifications:', error));
//   }
// }, [currentUser]);

 const handleHomeClick = () => {
    if (currentUser) {
      switch (currentUser.userType) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "broker":
          navigate("/broker-home");
          break;
        case "tenant":
          navigate("/tenant-home");
          break;
        default:
          navigate("/");
      }
    } else {
      navigate("/");
    }
 };

 const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
 };

 useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
 }, [location.search]);

 const handleNotificationClick = () => {
  // Logic to handle notification click
  // This could involve opening the MagicBell inbox or updating notification counts
  // For example, you might want to navigate to a specific page related to the notifications
  // navigate("/notifications");
};

 return (
    // <MagicBellProvider
      // apiKey="7a9b98ab0777134fc246eeab9aa82338718b0bff"
      // userEmail={currentUser?.email}
      // theme={{ icon: { borderColor: "white" } }}
    // >
      <header className="bg-slate-200 shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto p-3">
          <h1
            className="font-bold text-sm sm:text-xl flex flex-wrap cursor-pointer"
            onClick={handleHomeClick}
          >
            <span className="text-slate-500">Propert</span>
            <span className="text-slate-700">Ease</span>
          </h1>
          <form
            onSubmit={handleSubmit}
            className="bg-slate-100 p-3 rounded-lg flex items-center"
          >
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent focus:outline-none w-24 sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
              <FaSearch className="text-slate-600" />
            </button>
          </form>
          <div className="flex items-center gap-9 md:order-2">
            <div
              className="hidden sm:inline text-slate-700 hover:underline cursor-pointer"
              onClick={handleHomeClick}
            >
              Home
            </div>
            <Link to="/about">
              <div className="hidden sm:inline text-slate-700 hover:underline">
                About
              </div>
            </Link>
            <TawkChat
              propertyId="65f81d0d9317c543712903f2"
              widgetId="1hp8j2vfa"
            />
            {currentUser && currentUser.userType === "broker" && (
              <Link to="/messages-from-tenant">
                <SiGooglemessages className="text-slate-700 cursor-pointer w-5 h-5" />
              </Link>
            )}
            {/* Notification icon */}
            <div
              className="notification-icon"
              onClick={handleNotificationClick}
            >
              <FaBell className="text-slate-700 cursor-pointer" />
              {/* Example: Displaying a badge for new notifications */}
              {/* You would replace this with actual logic to fetch and display new notifications */}
              {/* <span className="badge">{notifications.length}</span> */}
            </div>
            <Link to="/profile">
              {currentUser ? (
                <img
                 className="rounded-full h-7 w-7 object-cover"
                 src={currentUser.avatar}
                 alt="profile"
                />
              ) : (
                <div
                 className="text-slate-700 hover:underline"
                 onClick={() => navigate("/sign-in")}
                >
                 Sign in
                </div>
              )}
            </Link>
          </div>
        </div>
      </header>
    // </MagicBellProvider>
 );
}

