import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  const renderRoleSpecificLinks = () => {
    if (currentUser && currentUser.role) {
      const basePath = `/${currentUser.role.toLowerCase()}-home`;
      return (
        <>
          <Link to={basePath}>
            <li className="text-slate-700 hover:underline">Home</li>
          </Link>
          <Link to={`${basePath}/profile`}>
            <li className="text-slate-700 hover:underline">Profile</li>
          </Link>
          {/* Add more role-specific links here */}
        </>
      );
    }
    return null;
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Property</span>
            <span className="text-slate-700">Ease</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <div className="flex items-center gap-9 md:order-2">
          <Link to="/">
            <div className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </div>
          </Link>
          <Link to="/about">
            <div className="hidden sm:inline text-slate-700 hover:underline">
              About
            </div>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <div className="text-slate-700 hover:underline">Sign in</div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
