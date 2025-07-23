
export default function ProfileSummary({ user, stats, latestTest }) {
  const { totalTests, averageScore, lastTestDate } = stats;
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg space-y-6 max-w-5xl mx-auto">
       
      {/* 👤 User Info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-wide">
            Welcome, <span className="text-blue-600">{user.firstName}</span> 
          </h2>
          <p className="mt-1 text-gray-500 text-base sm:text-lg">{user.email}</p>
        </div>
        {/* 🛠️ TODO: Later you can add a profile picture or edit button here */}
      </div>

      {/* 📊 Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-2xl shadow-inner text-center">
          <p className="text-sm font-medium text-blue-700 uppercase tracking-wide">Total Tests Taken</p>
          <p className="mt-2 text-3xl font-bold text-blue-900">{stats.totalTests}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-2xl shadow-inner text-center">
          <p className="text-sm font-medium text-green-700 uppercase tracking-wide">Average Score</p>
          <p className="mt-2 text-3xl font-bold text-green-900">{stats.averageScore}</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-2xl shadow-inner text-center">
          <p className="text-sm font-medium text-purple-700 uppercase tracking-wide">Last Test Date</p>
          <p className="mt-2 text-3xl font-bold text-purple-900">{stats.lastTestDate}</p>
        </div>
      </div>
    </div>
  );
}
