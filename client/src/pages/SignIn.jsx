import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
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
    try {
      dispatch(signInStart());
  
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `access_token=${Cookies.get("access_token")}`,
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        dispatch(signInFailure(data.message || "Failed to sign in."));
        return;
      }
  
      // Dispatch action to handle successful sign-in
      dispatch(signInSuccess(data));
  
      // Store the JWT token securely in the cookie
    Cookies.set("access_token", data.token, {
      expires: 30, // Expiration time in days
      path: "/api",
      secure: true,
      sameSite: "strict"
    });
      // Redirect user based on user type
      handleRedirect(data.userType);
    } catch (error) {
      console.error("Error during sign-in:", error.message);
      dispatch(signInFailure("Failed to sign in. Please try again."));
    }
  };

  const handleRedirect = (userType) => {
    switch (userType) {
      case "admin":
        navigate("/admin-dashboard");
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            className="border p-3 rounded-lg w-full"
            id="password"
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 py-2"
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "1rem",
            }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
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
