import React from 'react';


const formatTime = (seconds) => {
    
    if (seconds === undefined || seconds === null || isNaN(seconds)) {
        return "N/A";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    // Provide more specific output for edge cases
    if (minutes === 0 && remainingSeconds === 0) return "0s";
    if (minutes === 0) return `${remainingSeconds}s`; 
    if (remainingSeconds === 0) return `${minutes}m`; 
    return `${minutes}m ${formattedSeconds}s`; 
};




export default function StatsSummary({ result, compact = false }) {
  const accuracy = result.attempted > 0
    ? Math.round((result.correct / result.attempted) * 100)
    : 0;

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-gray-800">Latest Test</h4>
          <span className="text-sm text-gray-500">{formatTime(result.time_taken)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-indigo-600">{result.correct}</div>
            <div className="text-xs text-gray-500">Correct</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{result.attempted}</div>
            <div className="text-xs text-gray-500">Attempted</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{accuracy}%</div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, bgColor, textColor, icon }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-inner`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-700 text-lg font-semibold">{title}</p>
          <p className={`text-3xl font-bold ${textColor} mt-1`}>{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard title="Attempted" value={result.attempted} bgColor="bg-indigo-100" textColor="text-indigo-700"  />
      <StatCard title="Correct" value={result.correct} bgColor="bg-green-100" textColor="text-green-700"  />
      <StatCard title="Accuracy" value={`${accuracy}%`} bgColor="bg-yellow-100" textColor="text-yellow-700"  />
      <StatCard title="Time" value={formatTime(result.time_taken)} bgColor="bg-purple-100" textColor="text-purple-700" />
    </div>
  );
}
