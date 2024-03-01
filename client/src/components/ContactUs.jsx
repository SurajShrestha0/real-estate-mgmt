import {useState} from "react";
import { Link } from "react-router-dom";


export default function ContactUs() {

  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: ""
  });

  const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      setMessageSent(true);
      setError(null);
    } catch (error) {
      console.error("Error sending message:", error.message);
      setError("Failed to send message. Please try again later.");
    }
  };


  return (
     <div className="flex flex-row justify-between items-center max-w-6xl mx-auto p-3">
      {/* Left Column */}
      <div className="w-1/2 p-6 pl-0">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            <span>Contact</span> <br /> <span>PropertEase.com</span>
          </h2>
          <p>
            Are you looking for any kind of help and assistance? You can send us
            a message or give us a call so we can help and assist us. We are
            here to provide you with more information and deal with your
            queries.
            <br />
            <br />
            Talk to our customer representative to inquire about the process of
            selling/buying properties on PropertEase.com

          </p>
          <br />
          <br />
          <span className="font-bold">
            Call us:{" "}
            <span className="text-blue-700 cursor-pointer">9812345678</span>
          </span>
          <br />
          <br />
          <span className="font-bold">
            Email us:{" "}
            <span className="text-blue-700 cursor-pointer">
              admin@gmail.com
            </span>
          </span>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Related Information</h2>
          <ul>
            <li>
              <Link to="/profile">View Profile</Link>
            </li>
            
          </ul>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-1/2 p-8 pr-0">
        <h2 className="text-xl font-semibold mb-4">Send Message</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">
              Your Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="subject" className="block mb-1">
              Subject:
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter the subject of your message"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-1">
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-500"
          >
            Send Message  
          </button>
          {messageSent && <p className="text-green-600">Message sent successfully!</p>}
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}
 