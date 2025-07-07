        
export default function RecentTestsCard() {
  const recentTests = [
    { subject: "Physics", score: 18, total: 20, date: "2025-06-30" },
    { subject: "Math", score: 15, total: 20, date: "2025-06-28" },
    { subject: "Chemistry", score: 12, total: 20, date: "2025-06-25" },
    { subject: "English", score: 16, total: 20, date: "2025-06-22" },
  ]; // Replace this with real fetched test data

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
        Recent Test Results
      </h3>

      {recentTests.length === 0 ? (
        <p className="text-gray-500 text-sm">No tests taken yet.</p>
      ) : (
        <div className="space-y-4">
          {recentTests.map((test, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-semibold text-gray-900 text-lg">{test.subject}</p>
                <p className="text-sm text-gray-500">{test.date}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-900 font-bold text-lg">
                  {test.score}/{test.total}
                </p>
                {/* Uncomment below to show percentage */}
                {/* <p className="text-sm text-green-600">
                  {Math.round((test.score / test.total) * 100)}%
                </p> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
