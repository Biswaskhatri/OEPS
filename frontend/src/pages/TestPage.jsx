// import React,{useEffect} from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { BookOpen, History, Layers3 } from "lucide-react";

// function TestCard({ icon: Icon, title, description, route, buttonLabel }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between border border-gray-100">
//       <div>
//         <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
//           <Icon className="text-blue-600" />
//         </div>
//         <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
//         <p className="text-gray-600 text-sm">{description}</p>
//       </div>
//       <Link to={route} className="mt-6 inline-block">
//         <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 w-full font-semibold">
//           {buttonLabel}
//         </button>
//       </Link>
//     </div>
//   );
// }

// export default function TestPage() {
  
//   const navigate = useNavigate();

//   useEffect(() => {
//     const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//     if (!isLoggedIn) {
//       navigate("/auth",{replace:true}); // redirect to login/signup page
//     }
//   }, [navigate]);
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-16 bg-blue-50 min-h-screen ">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         <TestCard
//           icon={Layers3}
//           title="Mock Test"
//           description="100 randomly selected questions: 25 Physics, 25 Chemistry, 25 Math, 15 English, 10 Computer."
//           route="/test/daily"
//           buttonLabel="Start Daily Test"
//         />

//         <TestCard
//           icon={History}
//           title="Past Question Papers"
//           description="Solve real questions from previous CSIT entrance exams."
//           route="/test/past"
//           buttonLabel="View Past Papers"
//         />

//         <TestCard
//           icon={BookOpen}
//           title="Subject-Wise Test"
//           description="Choose your subject — Physics, Chemistry, Math, English, or Computer— and test your knowledge."
//           route="/test/subjects"
//           buttonLabel="Choose Subject"
//         />
//       </div>


//       <div className="mt-16 bg-white p-8 rounded-2xl shadow-lg">
//   <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
//   <div className="space-y-4">
//     <div className="border-b pb-4">
//       <h3 className="font-semibold text-gray-800">1. What is a Mock Test?</h3>
//       <p className="text-gray-600 text-sm mt-2">
//         A mock test is a practice test designed to simulate the actual CSIT entrance exam. It helps you assess your preparation level.
//       </p>
//     </div>
//     <div className="border-b pb-4">
//       <h3 className="font-semibold text-gray-800">2. How is the difficulty of questions determined?</h3>
//       <p className="text-gray-600 text-sm mt-2">
//         The system adapts question difficulty based on your past test performance using subject-wise tracking.
//       </p>
//     </div>
//     <div className="border-b pb-4">
//       <h3 className="font-semibold text-gray-800">3. Can I view my previous test results?</h3>
//       <p className="text-gray-600 text-sm mt-2">
//         Yes, your dashboard includes a history of your past tests, including scores and performance analytics.
//       </p>
//     </div>
//     <div className="border-b pb-4">
//       <h3 className="font-semibold text-gray-800">4. Is the mock test timed?</h3>
//       <p className="text-gray-600 text-sm mt-2">
//         Yes, each mock test is timed for 2 hours, just like the real CSIT entrance exam.
//       </p>
//     </div>
//   </div>
// </div>

//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, History, Layers3, ChevronDown, ChevronUp } from "lucide-react";



function TestCard({ icon: Icon, title, description, route, buttonLabel }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between border border-gray-100">
      <div>
        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <Icon className="text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <Link to={route} className="mt-6 inline-block">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 w-full font-semibold">
          {buttonLabel}
        </button>
      </Link>
    </div>
  );
}

function FAQItem({ question, answer, isOpen, toggle }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-200">
      <button
        onClick={toggle}
        className="flex justify-between items-center w-full text-left text-gray-800 font-semibold text-lg"
      >
        {question}
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>
      {isOpen && (
        <p className="mt-2 text-blue-900 font-bold font-serif leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function TestPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  const faqs = [
    {
      question: "What is a CSIT Mock Test?",
      answer: "It is a simulated test designed to help you prepare for the CSIT entrance exam effectively.",
    },
    
    {
      question: "Can I take subject-wise tests?",
      answer: "Yes, you can choose individual subjects like Physics, Math, English, etc. and take focused tests.",
    },
    {
      question: "Is the mock test time-bound?",
      answer: "Yes, the full mock test is time-bound to simulate the real exam environment '2 hours'",
    },
    {
      question: "Is there any negative marking in test ?",
      answer: "No, there is no negative marking in the mock tests. You can attempt all questions without penalty.",
    },
    {
     question: "Can I see my ranking?",
      answer:
        "Yes, you can see your percentile-based rank after completing at least one test.",
    },
    {
      question: "Is this system free to use?",
      answer:
        "Yes! All tests and features are completely free for CSIT entrance preparation.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (

    
    
    <div className="w-full bg-blue-50 min-h-screen px-6 py-16">

       <div className=" text-black rounded-2xl  mb-16 text-center">
      <h2 className="text-3xl font-semibold mb-2">You’re One Step Closer to CSIT!</h2>
      <p className="text-lg text-black-1000">Practice daily, improve weak areas, and unlock your best performance.</p>
    </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">

        
        <TestCard
          icon={Layers3}
          title="Mock Test"
          description="100 randomly selected questions: 25 Physics, 25 Chemistry, 25 Math, 15 English, 10 Computer."
          route="/test/daily"
          buttonLabel="Start Daily Test"
        />

        <TestCard
          icon={History}
          title="Past Question Papers"
          description="Solve real questions from previous CSIT entrance exams."
          route="/test/past-papers"
          buttonLabel="View Past Papers"
        />

        <TestCard
          icon={BookOpen}
          title="Subject-Wise Test"
          description="Choose your subject — Physics, Chemistry, Math, English, or Computer — and test your knowledge."
          route="/test/subjects"
          buttonLabel="Choose Subject"
        />
      </div>

     
        <div className="max-w-6xl  bg-white shadow-inner mx-auto px-5 py-8">
  <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Frequently Asked Questions</h2>
  <div className="max-w-4xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            toggle={() => toggleFAQ(index)}
          />
        ))}
      </div>
    </div>
    </div>
  );
}

