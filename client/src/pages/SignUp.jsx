import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function SignUp() {
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
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // if (!res.ok) {
      //   throw new Error(`HTTP error! Status: ${res.status}`);
      // }

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');

      // Continue with successful signup
      console.log(data);
    } catch (error) {
      // console.error('Error during signup:', error.message);
      setError(error.message);
      // setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-sembold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder='username'
          className="border p-3 rounded-lg"
          id="username" onChange={handleChange}
        />
        <input
          type="text"
          placeholder='email'
          className="border p-3 rounded-lg"
          id="email" onChange={handleChange}
        />
        <input
          type="text"
          placeholder='password'
          className="border p-3 rounded-lg"
          id="password" onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 
        rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
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
