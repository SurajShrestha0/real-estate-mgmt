import { useEffect, useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* <Link to="/"  onClick={handleHomeClick}> */}
        <h1
          className="font-bold text-sm sm:text-xl flex flex-wrap cursor-pointer"
          onClick={handleHomeClick}
        >
          <span className="text-slate-500">Propert</span>
          <span className="text-slate-700">Ease</span>
        </h1>
        {/* </Link> */}
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
          {/* <Link to="/"  onClick={handleHomeClick}> */}
          <div
            className="hidden sm:inline text-slate-700 hover:underline cursor-pointer"
            onClick={handleHomeClick}
          >
            Home
          </div>
          {/* </Link> */}
          <Link to="/about">
            <div className="hidden sm:inline text-slate-700 hover:underline">
              About
            </div>
          </Link>

          <FaBell className="text-slate-600 cursor-pointer" />

          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <div className="text-slate-700 hover:underline"
                onClick={() => navigate("/sign-in")}>Sign in</div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
