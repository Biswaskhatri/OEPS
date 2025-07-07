import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, History, Layers3 } from "lucide-react";

function TestCard({ icon: Icon, title, description, route, buttonLabel }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between border border-gray-100">
      <div>
        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <Icon className="text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <Link to={route} className="mt-6 inline-block">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 w-full font-semibold">
          {buttonLabel}
        </button>
      </Link>
    </div>
  );
}

export default function TestPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-blue-50 min-h-screen ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <TestCard
          icon={Layers3}
          title="Daily Mixed Test"
          description="100 randomly selected questions: 25 Physics, 25 Chemistry, 25 Math, 15 English, 10 General IT."
          route="/test/daily"
          buttonLabel="Start Daily Test"
        />

        <TestCard
          icon={History}
          title="Past Question Papers"
          description="Solve real questions from previous CSIT entrance exams year-wise with solutions."
          route="/test/past"
          buttonLabel="View Past Papers"
        />

        <TestCard
          icon={BookOpen}
          title="Subject-Wise Test"
          description="Choose your subject — Physics, Chemistry, Math, English, or General IT — and test your knowledge."
          route="/test/subjects"
          buttonLabel="Choose Subject"
        />
      </div>
    </div>
  );
}
