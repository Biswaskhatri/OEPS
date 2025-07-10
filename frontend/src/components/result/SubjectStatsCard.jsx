export default function SubjectStatsCard  ({ subject, correct, attempted, showProgress = true })  {
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:bg-indigo-50 transition-colors">
      <p className="text-indigo-700 font-semibold text-lg">{subject}</p>
      <p className="text-gray-600 text-sm mt-1">Correct: {correct}</p>
      <p className="text-gray-600 text-sm">Attempted: {attempted}</p>
      
      {showProgress && (
        <div className="mt-2">
          <div className="text-xs text-gray-500">Accuracy: {accuracy}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${accuracy}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
