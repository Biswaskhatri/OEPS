import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSummary from "../components/student/ProfileSummary";
import RecentTestsCard from "../components/student/RecentTest";

export default function Dashpage() {
  const navigate = useNavigate();

  // State for user, stats, recent tests
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/dashboard-summary")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setStats(data.stats);
        setRecentTests(data.recentTests || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading dashboard...</div>;
  }

  if (!user || !stats) {
    return <div className="text-center mt-20 text-red-500">Failed to load dashboard data.</div>;
  }

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

      <RecentTestsCard recentTests={recentTests} />
    </div>
  );
}
