import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function MessagesFromContactUs() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    // Fetch messages from the server
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/contact/messages");
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data); // Update messages state with fetched messages
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages(); // Call fetchMessages function when component mounts
  }, []); // Empty dependency array means this effect runs only once, when component mounts

  const handleClick = (message) => {
    if (selectedMessage && selectedMessage._id === message._id) {
      // If the same row is clicked again, close the dropdown
      setSelectedMessage(null);
    } else {
      // Otherwise, set the selected message and mark it as read
      setSelectedMessage(message);
      if (!message.isRead) {
        // Only update if the message is unread
        markMessageAsRead(message);
      }
    }
  };

  const markMessageAsRead = (message) => {
    // Update the message status in the database or API
    // For example, you can send a request to your server to update the message status
    // This can be done using a PUT or PATCH request to update the `isRead` property
    // Here's a simplified version using fetch:
    fetch(`/api/contact/messages/${message._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isRead: true }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to mark message as read");
        }
        // Update the messages state to reflect the changes
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === message._id ? { ...msg, isRead: true } : msg
          )
        );
      })
      .catch((error) => {
        console.error("Error marking message as read:", error);
      });
  };

  const handleDelete = (messageId) => {
    // Send a DELETE request to the backend API to delete the message
    fetch(`/api/contact/messages/${messageId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete message");
        }
        // Update the messages state to remove the deleted message
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
          
        );
        
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
      
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full flex flex-col bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-4">Messages from Contact Us</h2>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((message, index) => (
                  <React.Fragment key={index}>
                    <tr
                      className={`cursor-pointer ${message.isRead ? "bg-gray-200" : "hover:bg-gray-50"}`}
                      onClick={() => handleClick(message)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{message.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{message.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {message.isRead ? "Read" : "Unread"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        
                        <button
                          onClick={() => handleDelete(message._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {selectedMessage && selectedMessage._id === message._id && (
                      <tr className=" bg-gray-200">
                        <td colSpan="4" className="px-6 py-4  rounded-b-2xl">
                          <div className="">
                            <h3 className="text-base font-semibold text-gray-700 mb-2">Message from {selectedMessage.email}:</h3>
                            <p className="font-bold">{selectedMessage.message}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
