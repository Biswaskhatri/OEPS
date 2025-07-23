export default function RecentTestsCard({ recentTests }) {
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
                <p className="text-sm text-gray-500">{new Date(test.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-900 font-bold text-lg">
                  {test.score}/{test.total}
                </p>
               
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
