import QuickStatsSummary from './QuickStatsSummary';

export default function DashboardTestSummary({ recentResults }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Recent Test Results</h3>
      {recentResults.map((result, index) => (
        <QuickStatsSummary key={index} result={result} compact={true} />
      ))}
    </div>
  );
}
