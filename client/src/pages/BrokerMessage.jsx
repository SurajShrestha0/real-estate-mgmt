import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const BrokerMessage = () => {
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch form data for the current broker

    console.log("CurrentUser: ", currentUser);
    console.log("BrokerId: ", currentUser._id);
    const fetchFormData = async () => {
      try {
        // Assuming the endpoint to fetch form data is "/api/tenantFormData/getFormData"
        // and it expects a brokerId as a query parameter
        const response = await fetch(
          `/api/tenantFormData/getFormData?brokerId=${currentUser._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch form data");
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [currentUser._id]); // Depend on currentUser._id to refetch if it changes

  return (
    <div>
      <h1>Tenants Message</h1>
      <div>
        {notifications.map((formData, index) => (
          <div key={index} className="broker-message">
            <h2>New Form Data Received</h2>
            <p>Name: {formData.name}</p>
            <p>Phone Number: {formData.phoneNumber}</p>
            <p>Message: {formData.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrokerMessage;
