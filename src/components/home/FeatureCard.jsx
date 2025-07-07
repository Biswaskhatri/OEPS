export default function FeatureCard({ title, description, Icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
        {Icon && <Icon className="w-10 h-10 text-blue-600 mb-4 mx-auto" />}
      <h3 className="text-xl font-semibold text-blue-800 mb-3">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
