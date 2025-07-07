// ProfileSummary.jsx

// export default function ProfileSummary({ user, stats }) {
  
//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
//       {/* 👤 User Info */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.name} 👋</h2>
//           <p className="text-sm text-gray-500">{user.email}</p>
//         </div>
//         {/* 🛠️ TODO: Later you can add a profile picture or edit button here */}
//       </div>

//       {/* 📊 Stats Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
//         <div className="bg-blue-50 p-4 rounded-xl text-center">
//           <p className="text-sm text-gray-600">Total Tests Taken</p>
//           <p className="text-xl font-bold text-blue-700">{stats.totalTests}</p>
//         </div>
//         <div className="bg-green-50 p-4 rounded-xl text-center">
//           <p className="text-sm text-gray-600">Average Score</p>
//           <p className="text-xl font-bold text-green-700">{stats.averageScore}</p>
//         </div>
//         <div className="bg-purple-50 p-4 rounded-xl text-center">
//           <p className="text-sm text-gray-600">Last Test Date</p>
//           <p className="text-xl font-bold text-purple-700">{stats.lastTestDate}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function ProfileSummary({ user, stats }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg space-y-6 max-w-4xl mx-auto">
      {/* 👤 User Info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-wide">
            Welcome, <span className="text-blue-600">{user.name}</span> 👋
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
