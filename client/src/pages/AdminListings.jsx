import React from "react";
import Sidebar from "../components/Sidebar";

export default function Users() {
  return (
    <div className="flex gap-4">
      <Sidebar />
      <div className="p-5">AdminListings</div>
    </div>
  );
}
