import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSummary from "../components/dashboard/ProfileSummary";
import RecentTestsCard from "../components/dashboard/RecentTest";

export default function Dashpage() {
  const navigate = useNavigate();

  // ✅ Step 1: Dummy values to use for now (these work without backend)
  const [user, setUser] = useState({ name: "Om", email: "om@example.com" });
  const [stats, setStats] = useState({
    totalTests: 12,
    averageScore: 16.5,
    lastTestDate: "2025-06-30",
  });

  // 💡 Step 2: This will run later after backend is done
  /*
  useEffect(() => {
    fetch("/api/user/dashboard-summary") // 🔧 Your friend will build this API
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);     // 🧠 Set real user data here
        setStats(data.stats);   // 🧠 Set real stats data here
      })
      .catch((err) => console.error("Failed to fetch dashboard data", err));
  }, []);
  */

  // ✅ Step 3: Display loading if data hasn't arrived (only needed when using real API)
  /*
  if (!user || !stats) {
    return <div className="text-center mt-20 text-gray-500">Loading dashboard...</div>;
  }
  */

  // ✅ Step 4: Display dashboard normally
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <ProfileSummary user={user} stats={stats} />

      <div className="text-center">
        <button
          onClick={() => navigate("/test")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-2xl shadow-md transition"
        >
          📝 Take New Mock Test
        </button>
      </div>

      <RecentTestsCard />
    </div>
  );
}
