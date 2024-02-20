import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "", // Add userType field to the initial state
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send formData with userType included
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setError(data.message || "Failed to sign up.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setError("Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-sembold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <select
          className="border p-3 rounded-lg"
          id="userType" // Use userType as the id for the select input
          onChange={handleChange}
          value={formData.userType}
        >
          <option value="">Select user type</option>
          <option value="admin">Admin</option>
          <option value="broker">Broker</option>
          <option value="tenant">Tenant</option>
        </select>

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 
        rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
