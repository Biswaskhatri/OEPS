import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 

// Import your components
import StatsSummary from "../components/result/StatsSummary";  
import PerformanceChart from "../components/result/PerformanceChart";
import SubjectGrid from "../components/result/SubjectGrid";
import DifficultyPerformance from "../components/result/DifficultyPerformance";
import Feedback from "../components/result/Feedback";
import SubjectStatsCard from "../components/result/SubjectStatsCard"; // <--- NEW IMPORT for subject tests


const BASE_URL = "http://localhost:3001";

export default function TestResult() {
  const { resultId } = useParams(); 
  const navigate = useNavigate(); 

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/auth", { replace: true });
      return; 
    }

    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/test/result/${resultId}`, {
          credentials: "include", 
        });

        if (!response.ok) {
          const errorData = await response.json(); 
          throw new Error(errorData.message || "Failed to fetch result");
        }

        const data = await response.json();
        if (data.success && data.result) {
          setResult(data.result);
        } else {
          setError(data.message || "No result data found in response.");
        }
      } catch (err) {
        console.error("Error fetching result:", err);
        setError(err.message || "An unexpected error occurred while fetching results.");
      } finally {
        setLoading(false);
      }
    };

    if (resultId) { // Only fetch if resultId exists (from URL)
      fetchResult();
    } else {
      setError("No result ID provided in the URL.");
      setLoading(false);
    }
  }, [resultId, navigate]);

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

  // Prepare chart data conditionally for full tests only, or if subject_wise exists for a subject test (unlikely for PerformanceChart)
  let chartData = [];
  if (result.type === 'full' && result.subject_wise) {
      chartData = Object.keys(result.subject_wise).map((subject) => ({
        subject,
        correct: result.subject_wise[subject].correct,
        attempted: result.subject_wise[subject].attempted,
      }));
  }
  // For subject tests, chartData will remain empty, thus PerformanceChart won't render
  // unless you specifically design it to show single-subject data.

   const formatTime = (seconds) => {
    if (seconds === undefined || seconds === null) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Title Section - Dynamically show Full Test or Subject Test */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
            {result.type === 'full' 
              ? 'Your Full Test Result' 
              : `Your ${result.subject} Test Result`}
          </h1>
          <p className="text-gray-600">Detailed analysis of your performance</p>
        </div>

        {/* Combined Stats Summary (always relevant) */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <StatsSummary result={result} />
        </div>

        {/* Conditional Sections based on Test Type */}
        {result.type === 'full' ? (
          <>
            {/* Subject-wise Performance Chart (only for full tests) */}
            {chartData.length > 0 && ( // Only render if chart data is available (i.e., for full tests)
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <PerformanceChart data={chartData} title="📊 Subject-wise Performance" height={400} />
              </div>
            )}

            {/* Subject Details Grid (only for full tests) */}
            {result.subject_wise && Object.keys(result.subject_wise).length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <SubjectGrid subjectData={result.subject_wise} />
              </div>
            )}

            {/* Difficulty Performance (only if available for full tests) */}
            {result.difficulty_performance && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <DifficultyPerformance difficultyData={result.difficulty_performance} />
              </div>
            )}
          </>
        ) : ( // Render for 'subject' type test
          <>
            {/* Display single SubjectStatsCard for subject test */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Performance in {result.subject}
              </h3>
              <div className="flex justify-center"> {/* Center the single card */}
                <SubjectStatsCard
                  subject={result.subject}
                  correct={result.correct}
                  attempted={result.attempted}
                  showProgress={true}
                />
              </div>
            </div>

            {/* Difficulty Performance for subject tests (if applicable and structured) */}
            {/* Note: result.per_subject_difficulty might be the relevant field here for subject tests */}
            {result.per_subject_difficulty && result.per_subject_difficulty[result.subject] && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <DifficultyPerformance 
                        difficultyData={result.per_subject_difficulty[result.subject]} 
                        title={`Difficulty Breakdown for ${result.subject}`}
                    />
                </div>
            )}
          </>
        )}

        {/* Personalized Feedback (always relevant, assuming it's structured similarly for both types) */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <Feedback feedback={result.feedback} title="💬 Personalized Feedback" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => (window.location.href = "/test")} // Consider using navigate for SPA behavior
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Take Another Test
          </button>
          <button
            onClick={() => (window.location.href = "/")} // Consider using navigate for SPA behavior
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}