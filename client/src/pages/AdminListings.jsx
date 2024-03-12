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
    // console.log(user);
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
          <table className="table-auto w-full border border-gray-200 border-collapse striped ">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 bg-gray-100 text-bold">Date Created</th>
                <th className="px-4 py-2 bg-gray-100 text-bold">Username</th>
                <th className="px-4 py-2 bg-gray-100 text-bold">Title</th>
                <th className="px-4 py-2 bg-gray-100 text-bold">Description</th>
                <th className="px-4 py-2 bg-gray-100 text-bold">Address</th>
                <th className="px-4 py-2 bg-gray-100 text-bold">Regular Price</th>
                <th className="px-4 py-2 bg-gray-100 text-bold">Discount Price</th>
                <th className="px-4 py-2 bg-gray-100 text-bold">Bathrooms</th>
                <th className="px-4 py-2 bg-gray-100 text-bold">Bedrooms</th>
                <th className="px-4 py-2 bg-gray-100 text-bold">Furnished</th>
                <th className="px-4 py-2 bg-gray-100 text-bold">Parking</th>
                <th className="px-4 py-2 bg-gray-100 text-bold">Type</th>
                <th className="px-4 py-2 bg-gray-100 text-bold">Actions</th>
              </tr>
            </thead>
            <tbody>{renderListings()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
