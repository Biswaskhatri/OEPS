import React from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // Legend removed as requested
  ResponsiveContainer,
} from 'recharts';

/**
 * Custom Tooltip Content Component for accurate data display and debugging.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // payload[0] is the data series (our 'score' line)
    // payload[0].payload is the actual data object for the hovered point
    const dataPoint = payload[0].payload; 
    const scoreValue = dataPoint ? dataPoint.score : 'N/A'; // Defensive check

    // --- CRITICAL TOOLTIP DEBUG LOGS ---
    // Please provide the output of these logs when you hover over different points.
    console.log("TOOLTIP DEBUG: Full Payload:", JSON.parse(JSON.stringify(payload)));
    console.log("TOOLTIP DEBUG: Data point for hovered item:", JSON.parse(JSON.stringify(dataPoint)));
    console.log("TOOLTIP DEBUG: Score for hovered point (from dataPoint):", scoreValue);

    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        border: '1px solid #adb5bd',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        padding: '15px',
        color: '#212529',
        fontSize: '14px'
      }}>
        {/* Display the formatted date from the dataPoint */}
        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{`Test on ${dataPoint.date}`}</p>
        <p style={{ color: '#0056b3', fontWeight: 'bold', fontSize: '16px' }}>{`Score: ${scoreValue !== 'N/A' ? scoreValue.toFixed(2) : scoreValue}%`}</p>
      </div>
    );
  }
  return null;
};


/**
 * Renders an impressive and understandable line chart visualizing the user's performance
 * over their recent tests, with a filled area, and enhanced styling.
 * @param {Array<Object>} recentTests - An array of the user's recent test result objects.
 */
const PerformanceChart = ({ recentTests }) => {
  // Defensive check: Ensure recentTests is an array
  if (!Array.isArray(recentTests)) {
    console.error("PerformanceChart received non-array recentTests:", recentTests);
    return null;
  }

  // 1. Prepare Chart Data: Filter, sort, and format for display
  const chartData = [...recentTests]
    .filter(test => {
      const isValidScore = typeof test.normalized_score === 'number' && test.normalized_score !== null && !isNaN(test.normalized_score);
      const isValidDate = test.test_date && !isNaN(new Date(test.test_date));
      return isValidScore && isValidDate;
    })
    .sort((a, b) => new Date(a.test_date) - new Date(b.test_date))
    .map((test, index) => ({
      // 'date' for display, 'score' for Y-axis, 'testId' for UNIQUE X-axis dataKey
      date: new Date(test.test_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: test.normalized_score,
      testId: test._id || `test-${index}` // Fallback testId, crucial for uniqueness
    }));

  // --- CRITICAL DEBUG LOG FOR CHART DATA ITSELF ---
  // This should now show varied scores from your backend data.
  console.log("CHART DATA DEBUG: Final chartData array before rendering (JSON):", JSON.stringify(chartData, null, 2));


  // 2. Conditional Rendering: Message if not enough data for a meaningful chart
  if (chartData.length < 2) {
    return (
      <div className="text-center text-gray-600 p-4 font-inter text-lg bg-white rounded-lg shadow-inner">
        <p className="font-semibold mb-2">📊 Not Enough Data For Chart 📊</p>
        <p>Take at least 2 tests to see your performance progression!</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={380}>
      <AreaChart
        data={chartData}
        margin={{
          top: 25,
          right: 30,
          left: 20,
          bottom: 25,
        }}
      >
        <CartesianGrid strokeDasharray="4 4" stroke="#e9ecef" />

        {/* X-Axis: Now uses 'testId' as dataKey for uniqueness, but displays 'date' via tickFormatter */}
        <XAxis
          dataKey="testId" // <--- CRITICAL CHANGE: Use unique testId as dataKey
          tickFormatter={(value, index) => chartData[index].date} // <--- Display date
          tick={{ fill: '#333', fontSize: 14, fontWeight: 'bold' }}
          tickLine={false}
          axisLine={{ stroke: '#ced4da', strokeWidth: 1 }}
          padding={{ left: 20, right: 20 }}
          label={{ value: "Time (Test Date)", position: "insideBottom", offset: -25, fill: '#333', fontWeight: 'bold', fontSize: 15 }}
        />

        {/* Y-Axis: Score (%) - Bolder Labels, Increased Value Width */}
        <YAxis
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          tick={{ fill: '#333', fontSize: 14, fontWeight: 'bold' }}
          tickLine={false}
          axisLine={{ stroke: '#ced4da', strokeWidth: 1 }}
          label={{ value: "Score (%)", angle: -90, position: "insideLeft", offset: 0, fill: '#333', fontWeight: 'bold', fontSize: 15 }}
        />

        {/* Use the custom Tooltip component */}
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#999', strokeWidth: 1, strokeDasharray: '3 3' }} />

        <defs>
          <linearGradient id="colorScoreArea" x1="0" y1="0" x2="0" y2="1">
            {/* Even subtler gradient */}
            <stop offset="5%" stopColor="#007bff" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#66b3ff" stopOpacity={0.02}/>
          </linearGradient>
        </defs>

        <Area
          type="monotone"
          dataKey="score"
          stroke="#007bff"
          fillOpacity={1}
          fill="url(#colorScoreArea)"
          activeDot={false}
          key="area-score"
        />

        <Line
          type="monotone"
          dataKey="score"
          stroke="#0056b3"
          strokeWidth={4}
          dot={{ r: 6, fill: '#0056b3', stroke: '#fff', strokeWidth: 2 }}
          activeDot={{ r: 8, fill: '#0056b3', stroke: '#fff', strokeWidth: 2 }}
          name="Your Score"
          key="line-score"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
