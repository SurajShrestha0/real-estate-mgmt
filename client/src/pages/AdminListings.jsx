import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { FaCheck, FaTimes } from 'react-icons/fa'; 

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    fetchListings();
    fetchUsers();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/listing/get");
      const data = await response.json();
      console.log(data);
      setListings(data.listings || []);
    } catch (error) {
      console.error("Error fetching listings data: ", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user/getusers");
      const data = await response.json();
      console.log(data);
      setUserList(data.users || []);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };
  

  // Function to get username from user id
  const getUsernameFromUserId = (userId) => {
    const user = userList.find((user) => user._id === userId);

    return user ? user.username : "Unknown";
  };

  // Function to render listings table rows
  // Function to render listings table rows
const renderListings = () => {
  return listings.map((listing) => (
    <tr key={listing._id} className="bg-white border-gray-200 text-sm">
      
      <td className="px-4 py-2">{new Date(listing.createdAt).toLocaleDateString('en-US')}</td>

      <td className="px-4 py-2">
        {getUsernameFromUserId(listing._id)}
      </td>
    
      <td className="px-4 py-2">{listing.name}</td>
      <td className="px-4 py-2"><div className="h-20 overflow-y-auto">{listing.description}</div></td>
      <td className="px-4 py-2">{listing.address}</td>
      <td className="px-4 py-2">{listing.regularPrice.toLocaleString("en-IN")}</td>
      <td className="px-4 py-2">{listing.discountPrice.toLocaleString("en-IN")}</td>
      <td className="px-4 py-2">{listing.bathrooms}</td>
      <td className="px-4 py-2">{listing.bedrooms}</td>
      <td className="px-4 py-2">{listing.furnished ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}</td>
      <td className="px-4 py-2">{listing.parking ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}</td>
      <td className="px-4 py-2">{listing.type}</td>
      <td className="px-4 py-2">
        {/* Add actions buttons here */}
      </td>
    </tr>
  ));
};


  return (
    <div className="flex gap-4">
      <Sidebar className=""/>
      <div className="container mx-auto px-4 pt-8 ">
        <h1 className="text-3xl font-bold mb-4">Listings</h1>
        <div className="overflow-y-auto h-[615px]">
          <table className="table-auto w-full border border-gray-300 border-collapse striped ">
            <thead className="sticky top-0 z-50">
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200">Date Created</th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200 ">Username</th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200 ">Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200 ">Description</th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200 ">Address</th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200 ">Regular Price</th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200 ">Discount Price</th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200 ">Bathrooms</th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200 ">Bedrooms</th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200 ">Furnished</th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200 ">Parking</th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200 ">Type</th>
                <th className="px-6 py-3 text-left text-xs font-bold bg-slate-700 text-slate-200 ">Actions</th>
              </tr>
            </thead>
            <tbody>{renderListings()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
