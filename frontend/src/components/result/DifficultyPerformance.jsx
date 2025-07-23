export default function DifficultyPerformance({ difficultyData }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2"> Difficulty-wise Performance</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.keys(difficultyData).map((difficulty) => (
          <div key={difficulty} className="bg-white border rounded-lg shadow-sm p-4 hover:bg-green-50 transition-colors">
            <p className="text-green-700 font-semibold text-lg">{difficulty}</p>
            <p className="text-gray-600 text-sm mt-1">
              Correct: {difficultyData[difficulty].correct}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
