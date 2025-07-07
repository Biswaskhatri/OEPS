import React, { useState, useEffect } from "react";
import Timer from "../components/test/Timer";

const subjects = [
  "Physics",
  "Chemistry",
  "Math",
  "English",
  "General IT",
];

// Mock question data by subject (replace this with fetch from backend)
const questionsBySubject = {
  Physics: [
    {
      _id: "p1",
      question: "What is Newton's first law?",
      options: [
        "Inertia",
        "Force",
        "Acceleration",
        "Gravity"
      ],
    },
    // add more physics questions...
  ],
  Chemistry: [
    {
      _id: "c1",
      question: "What is H2O?",
      options: ["Water", "Oxygen", "Hydrogen", "Helium"],
    },
    // add more chemistry questions...
  ],
  Math: [
    {
      _id: "m1",
      question: "What is 2+2?",
      options: ["3", "4", "5", "6"],
    },
    // add more math questions...
  ],
  English: [
    {
      _id: "e1",
      question: "Select the correct spelling.",
      options: ["Accomodate", "Accommodate", "Acomodate", "Acommodate"],
    },
  ],
  "General IT": [
    {
      _id: "it1",
      question: "What does CPU stand for?",
      options: ["Central Processing Unit", "Computer Personal Unit", "Central Print Unit", "Control Processing Unit"],
    },
  ],
};

export default function SubjectTestPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedSubject) {
      // Simulate fetching from backend for the selected subject
      setQuestions(questionsBySubject[selectedSubject] || []);
      setAnswers({});
      setSubmitted(false);
    }
  }, [selectedSubject]);

  const handleAnswer = (qId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [qId]: selectedOption }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    console.log("User answers for", selectedSubject, answers);
    alert(`Test for ${selectedSubject} submitted!`);
    // You can send answers + user info to backend here
  };

  if (!selectedSubject) {
    // Show subject cards
    return (
      <div className="min-h-screen bg-blue-100 flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold mb-8">Choose a Subject</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className="bg-white shadow-md rounded-lg p-6 font-semibold text-blue-700 hover:bg-blue-200
              transition"
            >
              {subj}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Show test for selected subject
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-2">{selectedSubject} Test</h1>

      {!submitted && <Timer duration={25*60} onExpire={handleSubmit} />}

      <div className="mt-8 space-y-6 w-full max-w-3xl">
        {questions.map(({ _id, question, options }, index) => (
          <div
            key={_id}
            className="bg-white p-6 rounded-lg shadow-md mx-auto max-w-xl"
          >
            <p className="font-semibold mb-4 text-lg flex items-start">
              <span className="font-bold mr-3 min-w-[2.5rem] text-left">
                Q{index + 1}.
              </span>
              <span className="flex-1">{question}</span>
            </p>
            <div className="flex flex-col space-y-3">
              {options.map((opt) => (
                <label
                  key={opt}
                  className="cursor-pointer border border-gray-300 rounded px-4 py-2 flex items-center space-x-3 hover:border-blue-500 transition"
                >
                  <input
                    type="radio"
                    name={`question-${_id}`}
                    value={opt}
                    disabled={submitted}
                    checked={answers[_id] === opt}
                    onChange={() => handleAnswer(_id, opt)}
                    className="form-radio text-blue-600"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-8 px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
        >
          Submit Test
        </button>
      )}

      {submitted && (
        <div className="mt-8 p-4 bg-green-100 text-green-800 rounded font-semibold text-center">
          Thank you for submitting the {selectedSubject} test.
        </div>
      )}

      <button
        onClick={() => setSelectedSubject("")}
        className="mt-4 text-sm text-blue-600 underline"
      >
        Back to subjects
      </button>
    </div>
  );
}
