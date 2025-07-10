import React, { useState, useEffect } from "react";
import StatsSummary from "../components/result/StatsSummary";  
import PerformanceChart from "../components/result/PerformanceChart";
import SubjectGrid from "../components/result/SubjectGrid";
import DifficultyPerformance from "../components/result/DifficultyPerformance";
import Feedback from "../components/result/Feedback";


export default function TestResult({ resultId }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/test/result/${resultId}`);
        if (!response.ok) throw new Error("Failed to fetch result");
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (resultId) fetchResult();
  }, [resultId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your test results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50">
        <div className="bg-white p-10 rounded-lg shadow-md text-center text-red-600 font-semibold">
          <p>{error || "No result data available."}</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = Object.keys(result.subject_wise).map((subject) => ({
    subject,
    correct: result.subject_wise[subject].correct,
    attempted: result.subject_wise[subject].attempted,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
            🎯 Your Test Result
          </h1>
          <p className="text-gray-600">Detailed analysis of your performance</p>
        </div>

        {/* Combined Stats Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <StatsSummary result={result} />
        </div>

        {/* Subject-wise Performance Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <PerformanceChart data={chartData} title="📊 Subject-wise Performance" height={400} />
        </div>

        {/* Subject Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <SubjectGrid subjectData={result.subject_wise} />
        </div>

        {/* Difficulty Performance (only if available) */}
        {result.difficulty_performance && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <DifficultyPerformance difficultyData={result.difficulty_performance} />
          </div>
        )}

        {/* Personalized Feedback */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <Feedback feedback={result.feedback} title="💬 Personalized Feedback" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => (window.location.href = "/test")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Take Another Test
          </button>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
