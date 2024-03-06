import { useEffect, useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import io from "socket.io-client";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [newAdminNotifications, setNewAdminNotifications] = useState(0);
  const [newBrokerNotifications, setNewBrokerNotifications] = useState(0);
  const [newTenantNotifications, setNewTenantNotifications] = useState(0);

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

  useEffect(() => {
    if (currentUser) {
      const socket = io("http://localhost:3000"); // Replace with your WebSocket server URL

      socket.on("notification", (notification) => {
        // Update notifications count based on user type
        switch (currentUser.userType) {
          case "admin":
            setNewAdminNotifications((prevCount) => prevCount + 1);
            break;
          case "broker":
            setNewBrokerNotifications((prevCount) => prevCount + 1);
            break;
          case "tenant":
            setNewTenantNotifications((prevCount) => prevCount + 1);
            break;
          default:
            break;
        }
      });

      return () => {
        socket.disconnect(); // Disconnect WebSocket when component unmounts
      };
    }
  }, [currentUser]);

  const handleNotificationClick = () => {
    // Handle click action for notifications based on user type
    switch (currentUser.userType) {
      case "admin":
        setNewAdminNotifications(0);
        break;
      case "broker":
        setNewBrokerNotifications(0);
        break;
      case "tenant":
        setNewTenantNotifications(0);
        break;
      default:
        break;
    }
  };

  return (
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

          {/* Notification icon for admins */}
          {currentUser && currentUser.userType === "admin" && (
            <div
              className="notification-icon"
              onClick={handleNotificationClick}
            >
              <FaBell className="text-slate-700 cursor-pointer" />
              {newAdminNotifications > 0 && (
                <span className="badge">{newAdminNotifications}</span>
              )}
            </div>
          )}

          {/* Notification icon for brokers */}
          {currentUser && currentUser.userType === "broker" && (
            <div
              className="notification-icon"
              onClick={handleNotificationClick}
            >
              <FaBell className="text-slate-700 cursor-pointer" />
              {newBrokerNotifications > 0 && (
                <span className="badge">{newBrokerNotifications}</span>
              )}
            </div>
          )}

          {/* Notification icon for tenants */}
          {currentUser && currentUser.userType === "tenant" && (
            <div
              className="notification-icon"
              onClick={handleNotificationClick}
            >
              <FaBell className="text-slate-700 cursor-pointer" />
              {newTenantNotifications > 0 && (
                <span className="badge">{newTenantNotifications}</span>
              )}
            </div>
          )}

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
  );
}
