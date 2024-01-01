import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({});
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
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();

        if (res.status === 404) {
          // User not found
          setError("User not found. Please check your email.");
        } else if (res.status === 401) {
          // Wrong password
          setError("Incorrect password. Please try again.");
        } else {
          // Other server errors
          setError(data.message || "An error occurred during sign-in.");
        }

        setLoading(false);
        return;
      }

      const data = await res.json();

      setLoading(false);
      setError(null);
      navigate("/");

      // Continue with successful sign-in
      console.log(data);
    } catch (error) {
      console.error("Error during sign-in:", error.message);
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-sembold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password" // Change type to password for sensitive information like passwords
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 
        rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="flex gap-2 mt-5">
        <p>Don't Have an Account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
    </div>
  );
}
