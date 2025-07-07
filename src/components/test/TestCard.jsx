import React from "react";
import { Link } from "react-router-dom";

export default function TestCard({ icon: Icon, title, description, route, buttonLabel }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between border border-gray-100">
      <div>
        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <Icon className="text-blue-600" size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <Link to={route} className="mt-6 inline-block">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full font-semibold">
          {buttonLabel}
        </button>
      </Link>
    </div>
  );
}
