import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { FaTrashAlt } from 'react-icons/fa';
import { deleteUser } from "../../../api/controller/user.controller";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // State for search input
  const [sortOption, setSortOption] = useState(""); // State for sort option

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/getusers");
      const data = await response.json();
      // Filter out users whose userType is not "Admin"
      const filteredUsers = data.users.filter(
        (user) => user.userType !== "admin"
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const message = await deleteUser(userId);
      if (message === "User has been deleted!") {
        // Remove the deleted user from the state
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
      } else {
        console.error("Error deleting user: ", message);
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  // Function to handle search input change
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  // Function to handle sort option change
  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  // Filter and sort users based on inputs
  const filteredAndSortedUsers = users
    .filter((user) =>
      user.username.toLowerCase().includes(searchInput.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "Broker") {
        return a.userType.localeCompare(b.userType);
      } else if (sortOption === "Tenant") {
        return b.userType.localeCompare(a.userType);
      }
      return 0;
    });

  // Calculate the count of tenants and brokers
  const tenantCount = filteredAndSortedUsers.filter(
    (user) => user.userType.toLowerCase() === "tenant"
  ).length;
  const brokerCount = filteredAndSortedUsers.filter(
    (user) => user.userType.toLowerCase() === "broker"
  ).length;

  return (
    <div className="flex gap-4">
      <Sidebar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-10">
          <h1 className="text-3xl font-bold mb-4">User List:</h1>
          <span className="text-base font-bold">
            Total Users:{" "}
            <span className="text-3xl">{filteredAndSortedUsers.length}</span>
          </span>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Search Bar */}
          <div className="mb-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
          </div>
          {/* Sort Dropdown */}
          <div className="mb-4 w-full md:w-auto">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortOption}
              onChange={handleSortOptionChange}
            >
              <option value="">Sort by</option>
              <option value="Broker">Broker</option>
              <option value="Tenant">Tenant</option>
            </select>
          </div>

          {/* User Counts */}
          <div className="flex flex-col md:flex-row gap-5 md:gap-10 items-center md:items-start">
            <span className="text-lg font-bold">TENANT: {tenantCount}</span>
            <span className="text-lg font-bold">BROKER: {brokerCount}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            {/* Table content */}
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200">
                  Date Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200">
                  User Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedUsers.map((user) => (
                <tr key={user._id} className="bg-white border-gray-200 text-sm">
                  <td className="px-4 py-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 uppercase font-semibold">
                    {user.userType}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className=" hover:bg-red-700  py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 flex items-center justify-center"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <FaTrashAlt className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
