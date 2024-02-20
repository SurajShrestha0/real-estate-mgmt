import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error } = useSelector((state) => state.user);
  console.log("Redux state:", loading, error); // Log Redux stated
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData); // Log form data
    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message || "Failed to sign in."));
        return;
      }

      dispatch(signInSuccess(data));

      localStorage.setItem("userType", data.userType);

      handleRedirect(data.userType);

    } catch (error) {
      console.error("Error during sign-in:", error.message);
      dispatch(signInFailure("Failed to sign in. Please try again."));
    }
  };

  const handleRedirect = (userType) => {
    switch (userType) {
      case "admin":
        navigate("/admin-home");
        break;
      case "broker":
        navigate("/broker-home");
        break;
      case "tenant":
        navigate("/tenant-home");
        break;
      default:
        console.error("Invalid user type:", userType);
        dispatch(signInFailure("Invalid user type."));
        // Navigate to a generic home page or display an error message
        break;
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
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
        <OAuth />
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
