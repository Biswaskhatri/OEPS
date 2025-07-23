import React, { useState, useEffect } from 'react';

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:3001"; // Ensure this matches your backend URL

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        // --- UPDATED FETCH URL ---
        const response = await fetch(`${BASE_URL}/api/dashboard/top-performers`, { // <--- Changed URL
          method: 'GET',
          credentials: 'include' // If leaderboard requires authentication
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch leaderboard data.');
        }

        const data = await response.json();
        setLeaderboardData(data.leaderboard);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError(err.message || "Could not load leaderboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-inter">
        <div className="text-center text-gray-600 text-lg">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-inter">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-inter">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
           Top Performers Leaderboard 
        </h1>

        {leaderboardData.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No test results yet to display on the leaderboard. Be the first!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold rounded-tl-lg">Rank</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Username</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Avg. Score (%)</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold rounded-tr-lg">Tests Taken</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry, index) => (
                  <tr key={entry.userId} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors duration-200`}>
                    <td className="py-3 px-4 border-b border-gray-200 text-lg font-bold text-gray-800">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index >= 3 && `${index + 1}.`}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 text-gray-700 font-medium">{entry.username}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-gray-700">{entry.averageNormalizedScore}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-gray-700">{entry.totalTestsTaken}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
