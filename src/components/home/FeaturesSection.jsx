import FeatureCard from "./FeatureCard";
import { LayoutDashboard,TrendingUp,BookOpenCheck,} from "lucide-react";


const features = [
  {
    title: "User Dashboard",
    description:
      "Easily access your test history, progress, and personalized stats from a clean dashboard.",
       icon: LayoutDashboard,
  },
  {
    title: "Track Your Progress",
    description:
      "Get insights into your performance across different subjects and improve weak areas.",
      icon: TrendingUp,
  },
  {
    title: "Subject-wise Tests",
    description:
      "Take mock tests by selecting individual subjects like Physics, Chemistry, English, Math and General IT.",
      icon: BookOpenCheck,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 md:px-12 bg-blue-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Features That Help You Improve
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              Icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
