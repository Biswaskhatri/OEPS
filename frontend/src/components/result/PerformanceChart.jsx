import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PerformanceChart({ data, title = "Performance Chart", height = 300 }) {
  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="correct" fill="rgba(34, 197, 94, 0.7)" name="Correct Answers" />
            <Bar dataKey="attempted" fill="rgba(59, 130, 246, 0.7)" name="Attempted Questions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
