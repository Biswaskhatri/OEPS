export default function Feedback({ feedback }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-3">💬 Personalized Feedback</h3>
      <div className="space-y-2">
        {feedback.map((item, i) => (
          <div key={i} className="bg-yellow-100 px-4 py-3 rounded-lg shadow-sm border-l-4 border-yellow-400">
            <p className="text-gray-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}