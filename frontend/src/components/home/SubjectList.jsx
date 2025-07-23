

import SubjectCard from "./SubjectCard";
import {
  Atom,
  Calculator,
  BookOpen,
  FlaskConical,
  MonitorCheck,
} from "lucide-react";

const subjects = [
  {
    subject: "Physics",
    icon: Atom,
    
  },
  {
    subject: "Mathematics",
    icon: Calculator,
   
  },
  {
    subject: "English",
    icon: BookOpen,
  },
    
  {
    subject: "Chemistry",
    icon: FlaskConical,
   
  },
  {
    subject: "Computer",
    icon: MonitorCheck,
   
  },
];

export default function SubjectList() {
  return (
    <section className="py-16 px-4 md:px-12 bg-blue-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Subject Tests We Provide
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subjects.map((subj, index) => (
            <SubjectCard
              key={index}
              subject={subj.subject}
              description={subj.description}
              Icon={subj.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
