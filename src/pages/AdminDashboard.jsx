import React from "react";
import AddQuestion from "../components/admin/AddQuestion";
import DeleteQuestion from "../components/admin/DeleteQuestion";
import EditQuestion from "../components/admin/EditQuestion";
import SearchQuestion from "../components/admin/SearchQuestion";

export default function AdminDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 text-center mb-10">
          Manage CSIT Questions
        </h1>

        <AddQuestion />
        <DeleteQuestion />
        <EditQuestion />
        <SearchQuestion />
      </div>
    </div>
  );
}
