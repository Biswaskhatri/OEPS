


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ProfileSummary from "../components/student/ProfileSummary";
// import RecentTestsCard from "../components/student/RecentTest";
// import PerformanceChart from "../components/student/PerformanceChart";

// export default function Dashpage() {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [stats, setStats] = useState(null);
//   const [recentTests, setRecentTests] = useState([]);
//   const [leaderboardData, setLeaderboardData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const BASE_URL = "http://localhost:3001";

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch(`${BASE_URL}/api/user/dashboard-summary`, {
//           credentials: "include",
//         });

//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(errorData.message || "Failed to fetch dashboard data");
//         }

//         const data = await res.json();
//         console.log("FRONTEND DEBUG: Data received from backend:", data);
        
//         setUser(data.user);
//         setStats(data.stats);
//         setRecentTests(data.recentTests || []);
//         setLeaderboardData(Array.isArray(data.leaderboard) ? data.leaderboard : []); 

//       } catch (err) {
//         console.error("FRONTEND DEBUG: Error fetching dashboard data:", err);
//         setError(err.message || "Failed to load dashboard data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   // --- Conditional Rendering Logic ---
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center text-gray-500 text-lg">Loading dashboard...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center text-red-500 text-lg">
//           <p>{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!user || !stats) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center text-gray-600 text-lg">
//           <p>No dashboard data found. Please ensure you are logged in and have taken tests.</p>
//         </div>
//       </div>
//     );
//   }

//   const latestTest = stats.latestTest;

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 font-inter">
//       <ProfileSummary user={user} stats={stats} latestTest={latestTest} />

//       {latestTest && latestTest.percentile_rank !== null ? (
//         <div className="p-6 bg-white rounded-xl shadow-md border border-blue-200">
//           <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Your Latest Performance</h2>
//           <div className="text-center">
//             <p className="text-blue-700 text-lg font-semibold">Your Percentile Rank:</p>
//             <p className="text-blue-900 text-5xl font-extrabold mt-2">
//               {`${latestTest.percentile_rank}th`}
//             </p>
//             <p className="text-blue-600 text-sm mt-1">
//               (Compared to recent test takers)
//             </p>
//           </div>
           
//         </div>
//       ) : latestTest && latestTest.percentile_rank === null ? (
//         <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center text-gray-600">
//           <p>Your percentile rank will be available after more users complete tests.</p>
//           <p className="text-sm mt-2">
//             (Percentile is calculated among the latest 15 test submissions)
//           </p>
//         </div>
//       ) : (
//         <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center text-gray-600">
//           <p>No test results found yet. Take a test to see your performance!</p>
//         </div>
//       )}

//       <div className="text-center">
//         <button
//           onClick={() => navigate("/test")}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition duration-300 transform hover:scale-105"
//         >
//           📝 Take New Mock Test
//         </button>
//       </div>

     




//       {/* --- CONDITIONAL LEADERBOARD SECTION --- */}
//       {stats.totalTests > 0 && ( // <--- ONLY SHOW LEADERBOARD IF USER HAS TAKEN AT LEAST ONE TEST
//         <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
//           <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//             🏆 Global Leaderboard 🏆
//           </h2>

//           {leaderboardData.length === 0 ? (
//             <p className="text-center text-gray-600 text-lg">
//               No test results yet to display on the leaderboard. Be the first!
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//                 <thead className="bg-blue-600 text-white">
//                   <tr>
//                     <th className="py-3 px-4 text-left text-sm font-semibold rounded-tl-lg">Rank</th>
//                     <th className="py-3 px-4 text-left text-sm font-semibold">Username</th>
//                     <th className="py-3 px-4 text-left text-sm font-semibold">Avg. Score (%)</th>
//                     <th className="py-3 px-4 text-left text-sm font-semibold rounded-tr-lg">Tests Taken</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {leaderboardData.map((entry, index) => (
//                     <tr key={entry.userId} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors duration-200`}>
//                       <td className="py-3 px-4 border-b border-gray-200 text-lg font-bold text-gray-800">
//                         {index === 0 && '🥇'}
//                         {index === 1 && '🥈'}
//                         {index === 2 && '🥉'}
//                         {index >= 3 && `${index + 1}.`}
//                       </td>
//                       <td className="py-3 px-4 border-b border-gray-200 text-gray-700 font-medium">{entry.username}</td>
//                       <td className="py-3 px-4 border-b border-gray-200 text-gray-700">{entry.averageNormalizedScore}</td>
//                       <td className="py-3 px-4 border-b border-gray-200 text-gray-700">{entry.totalTestsTaken}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )} {/* <--- CLOSING PARENTHESIS FOR CONDITIONAL RENDERING */}

     
//       {recentTests.length > 1 && ( // Only show chart if there are at least 2 tests for a trend
//         <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
//           <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//             📈 Your Performance Progression 📈
//           </h2>
//           <PerformanceChart recentTests={recentTests} />
//         </div>
//       )}
//       {recentTests.length <= 1 && ( // Message if not enough tests for a chart
//         <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center text-gray-600">
//           <p>Take more tests to see your performance progression chart!</p>
//           <p className="text-sm mt-2">
//             (Chart requires at least 2 test submissions)
//           </p>
//         </div>
//       )}



//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSummary from "../components/student/ProfileSummary";
import RecentTestsCard from "../components/student/RecentTest";
import PerformanceChart from "../components/student/PerformanceChart"; // Make sure this import is correct

export default function Dashpage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${BASE_URL}/api/user/dashboard-summary`, {
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch dashboard data");
        }

        const data = await res.json();
        console.log("FRONTEND DEBUG: Data received from backend:", data);
        
        setUser(data.user);
        setStats(data.stats);
        
        // Ensure recentTests is always an array
        setRecentTests(Array.isArray(data.recentTests) ? data.recentTests : []);
        setLeaderboardData(Array.isArray(data.leaderboard) ? data.leaderboard : []); 

      } catch (err) {
        console.error("FRONTEND DEBUG: Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- Conditional Rendering Logic ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-500">
        <div className="text-center text-red-500 text-lg">
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

  if (!user || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-300">
        <div className="text-center text-gray-600 text-lg">
          <p>No dashboard data found. Please ensure you are logged in and have taken tests.</p>
        </div>
      </div>
    );
  }

  const latestTest = stats.latestTest;

  return (

    <div className="min-h-screen bg-blue-100"> 
    
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 font-inter ">
      <ProfileSummary user={user} stats={stats} latestTest={latestTest} />

      {latestTest && latestTest.percentile_rank !== null ? (
        <div className="p-6 bg-white rounded-xl shadow-md border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Your Latest Performance</h2>
          <div className="text-center">
            <p className="text-blue-700 text-lg font-semibold">Your Percentile Rank:</p>
            <p className="text-blue-900 text-5xl font-extrabold mt-2">
              {`${latestTest.percentile_rank}th`}
            </p>
            <p className="text-blue-600 text-sm mt-1">
              (Compared to recent test takers)
            </p>
          </div>
          <div className="mt-4 text-center">
            <p className="text-green-700 text-lg font-semibold">Normalized Score:</p>
            <p className="text-green-900 text-3xl font-bold mt-1">
              {`${latestTest.normalized_score}%`}
            </p>
          </div>
        </div>
      ) : latestTest && latestTest.percentile_rank === null ? (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center text-gray-600">
          <p>Your percentile rank will be available after more users complete tests.</p>
          <p className="text-sm mt-2">
            (Percentile is calculated among the latest 15 test submissions)
          </p>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center text-gray-600">
          <p>No test results found yet. Take a test to see your performance!</p>
        </div>
      )}

    

      {/* Performance Progression Chart Section */}
      {recentTests.length > 1 ? ( // Only show chart if there are at least 2 tests for a trend
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            📈 Your Performance Progression 
          </h2>
          <PerformanceChart recentTests={recentTests} />
        </div>
      ) : ( // Message if not enough tests for a chart
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center text-gray-600">
          <p>Take more tests to see your performance progression chart!</p>
          <p className="text-sm mt-2">
            (Chart requires at least 2 test submissions)
          </p>
        </div>
      )}

     

      {/* Global Leaderboard Section */}
      {stats.totalTests > 0 && (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🏆 Global Leaderboard 
          </h2>

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
      )}
      </div>
       <div className="text-center">
        <button
          onClick={() => navigate("/test")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 mx-8 my-8 rounded-2xl shadow-lg transition duration-300 transform hover:scale-105"
        >
          📝 Take New Mock Test
        </button>
      </div>
    </div>
    
  );
  
}

