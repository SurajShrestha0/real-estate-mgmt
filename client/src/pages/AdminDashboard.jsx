import { FaHandshake, FaTags, FaUsers } from "react-icons/fa6";
import Sidebar from "../components/Sidebar";
import { FaHouse } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";


export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalListings, setTotalListings] = useState(0);
  const [noOfRent, setNoOfRent] = useState(0);
  const [noOfSale, setNoOfSale] = useState(0);
  
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalListings();
  }, []);

  useEffect(() => {
    if (totalListings) {
      const rentListings = totalListings.filter(listing => listing.type === 'rent');
      const saleListings = totalListings.filter(listing => listing.type === 'sale');
      setNoOfRent(rentListings.length);
      setNoOfSale(saleListings.length);
    }
  }, [totalListings]);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      
      const ctx = chartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Houses for Rent", "Houses for Sale"],
          datasets: [
            {
              label: "Number of Houses",
              data: [noOfRent, noOfSale],
              backgroundColor: ["#48BB78", "#4299E1"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }, [noOfRent, noOfSale]);

  const fetchTotalUsers = async () => {
    try {
      const res = await fetch("api/user/getusers");
      const data = await res.json();
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error("Error fetching total users:", error);
    }
  };

  const fetchTotalListings = async () => {
    try {
      const res = await fetch("api/listing/get");
      const data = await res.json();
      setTotalListings(data.listings);
    } catch (error) {
      console.error("Error fetching Listings:", error);
    }
  };

  return (
    <div className="flex gap-4">
      <Sidebar />
      <div className="pt-5">
        <div className="flex flex-wrap gap-5 justify-center">
          {/* Box for totalUsers */}
          <div className="bg-gray-200 p-8 flex justify-between rounded-lg shadow-md flex-grow gap-5 cursor-pointer hover:transform hover:scale-105">
            {/* User icon */}
            <div>
              <h3 className="text-gray-500 text-md uppercase"> Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <FaUsers className="bg-green-600  text-white rounded-full text-5xl p-3 ml-20 shadow-lg" />
          </div>

          {/* Box for Total Listings */}
          <div className="bg-gray-200 p-8 flex justify-between rounded-lg shadow-md flex-grow gap-8 cursor-pointer hover:transform hover:scale-105">
            {/* Listing icon */}
            <div>
              <h3 className="text-gray-500 text-md uppercase"> Total Listings</h3>
              <p className="text-2xl">{totalListings.length}</p>
            </div>
            <FaHouse className="bg-blue-600  text-white rounded-full text-5xl p-3 ml-20 shadow-lg" />
          </div>

          {/* Box for Houses for Rent */}
          <div className="bg-gray-200 p-8 flex justify-between rounded-lg shadow-md flex-grow gap-8 cursor-pointer hover:transform hover:scale-105">
            {/* Rent icon */}
            <div>
              <h3 className="text-gray-500 text-md uppercase"> Houses for Rent</h3>
              <p className="text-2xl">{noOfRent}</p>
            </div>
            <FaTags className="bg-cyan-600  text-white rounded-full text-5xl p-3 ml-20 shadow-lg" />
          </div>

          {/* Box for Houses for Sale */}
          <div className="bg-gray-200 p-8 flex justify-between rounded-lg shadow-md flex-grow gap-8 cursor-pointer hover:transform hover:scale-105">
            {/* Sale icon */}
            <div>
              <h3 className="text-gray-500 text-md uppercase"> Houses for Sale</h3>
              <p className="text-2xl">{noOfSale}</p>
            </div>
            <FaHandshake className="bg-gray-600  text-white rounded-full text-5xl p-3 ml-20 shadow-lg" />
          </div>
        </div>

        {/* Pie Charts */}
        <div className="flex flex-wrap gap-5 justify-center hover:transform hover:scale-105 cursor-pointer">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
}
