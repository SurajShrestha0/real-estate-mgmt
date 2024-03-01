import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { deleteUser } from "../../../api/controller/user.controller";


export default function Users() {

  const [users, setUsers] = useState([]);

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
  

  return (
    <div className="flex gap-4">
      <Sidebar />
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">User List</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Date Created</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">User Type</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="bg-white border-gray-200">
                <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.userType}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
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
