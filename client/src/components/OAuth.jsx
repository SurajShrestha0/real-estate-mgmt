import React, { useState } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showUserTypeDialog, setShowUserTypeDialog] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [googleUser, setGoogleUser] = useState(null);

  const handleGoogleClick = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      // Sign in with Google
      const result = await signInWithPopup(auth, provider);

      // Store the Google user data for later use
      setGoogleUser(result.user);

      // Show the user type selection dialog
      setShowUserTypeDialog(true);
    } catch (error) {
      console.error("Error during Google authentication:", error);
      // Handle the error appropriately
    }
  };

  const handleUserTypeSelection = async (userType) => {
    setSelectedUserType(userType);
    setShowUserTypeDialog(false);

    // Send the Google user data along with the selected user type to the server
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: googleUser.displayName,
        email: googleUser.email,
        photo: googleUser.photoURL,
        userType,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(signInSuccess(data));
      // Redirect to the user's dashboard based on their user type
      if (userType === "broker") {
        navigate("/broker-home");
      } else if (userType === "tenant") {
        navigate("/tenant-home");
      }
    } else {
      console.error(`Fetch request failed with status: ${res.status}`);
      // Handle the error appropriately
    }
  };

  return (
    <>
      <button
        onClick={handleGoogleClick}
        type="button"
        className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
      >
        Continue with Google
      </button>

      {showUserTypeDialog && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Select User Type
                    </h3>
                    <div className="mt-2">
                      <button
                        onClick={() => handleUserTypeSelection("broker")}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Broker
                      </button>
                      <button
                        onClick={() => handleUserTypeSelection("tenant")}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
                      >
                        Tenant
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowUserTypeDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
