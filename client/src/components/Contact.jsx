import { useEffect, useState } from "react";

export default function Contact({ listing }) {
 const [broker, setBroker] = useState(null);
 const [name, setName] = useState("");
 const [phoneNumber, setPhoneNumber] = useState("");
 const [message, setMessage] = useState("");
 const [notification, setNotification] = useState("");

 useEffect(() => {
    const fetchBroker = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setBroker(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBroker();
 }, [listing.userRef]);

 const onChangeName = (e) => setName(e.target.value);
 const onChangePhoneNumber = (e) => setPhoneNumber(e.target.value);
 const onChangeMessage = (e) => setMessage(e.target.value);

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/tenantFormData/saveFormData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phoneNumber,
          message,
          brokerId: broker._id,
          listingName: listing.name,
        }),
      });
      if (response.ok) {
        console.log("Form data saved successfully!");
      } else {
        console.error("Failed to save form data");
      }
    } catch (error) {
      console.error("Error saving form data:", error);
    }
 };

 return (
    <>
        <div className="flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg">
          <p className="text-xl font-semibold">
            Contact{" "}
            <span className="font-bold text-slate-700">{broker.username}</span>{" "}
            for{" "}
            <span className="font-bold text-slate-700">
              {listing.name.toLowerCase()}
            </span>
          </p>
          {notification && (
            <div className="bg-gray-200 p-2 rounded-lg">{notification}</div>
          )}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <input
                 type="text"
                 value={name}
                 onChange={onChangeName}
                 placeholder="Your Name"
                 className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                 type="tel"
                 value={phoneNumber}
                 onChange={onChangePhoneNumber}
                 placeholder="Phone Number"
                 className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <textarea
                 name="message"
                 id="message"
                 rows="4"
                 value={message}
                 onChange={onChangeMessage}
                 placeholder="Enter your message here..."
                 className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-4 bg-slate-700 text-white rounded-lg hover:opacity-95"
              >
                Send to {broker.username}
              </button>
            </form>
      
        </div>
    </>
 );
}
