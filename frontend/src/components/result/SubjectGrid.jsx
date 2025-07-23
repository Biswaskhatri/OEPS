import React from 'react';
import SubjectStatsCard from './SubjectStatsCard'; // Correct import

export default function SubjectGrid({ subjectData, title = "Subject Performance" }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">📚 {title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.keys(subjectData).map((subject) => (
          <SubjectStatsCard // <--- CHANGED FROM SubjectCard to SubjectStatsCard
            key={subject}
            subject={subject}
            correct={subjectData[subject].correct}
            attempted={subjectData[subject].attempted}
          />
        ))}
      </div>
    </div>
  );
}