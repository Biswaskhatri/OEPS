import React, { useState, useEffect } from "react";
import Timer from "../components/test/Timer";
import { useNavigate } from "react-router-dom";

const subjects = [
  "Physics",
  "Chemistry",
  "Math",
  "English",
  "General IT",
];

const BASE_URL = "http://192.168.18.9:3001"; // Your backend URL

export default function SubjectTestPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  if (selectedSubject) {
    setLoading(true);
    setError(null);
    setAnswers({});
    setSubmitted(false);

    fetch(`${BASE_URL}/api/test/questions?subject=${encodeURIComponent(selectedSubject)}`, {
      credentials: "include", // ✅ required for session auth
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch questions for ${selectedSubject}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.questions)) {
          const formattedQuestions = data.questions.map((q) => ({
            _id: q.question_id || q._id,
            question: q.question_text || q.question,
            options: q.options ? Object.values(q.options) : [],
          }));
          setQuestions(formattedQuestions);
        } else {
          setQuestions([]);
          setError("No questions found for this subject.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching questions. Please try again later.");
        setLoading(false);
      });
  }
}, [selectedSubject]);

  const handleAnswer = (qId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [qId]: selectedOption }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    console.log("User answers for", selectedSubject, answers);
    alert(`Test for ${selectedSubject} submitted!`);
    // TODO: Send answers + user info to backend here if needed
  };

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-blue-100 flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold mb-8">Choose a Subject</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className="bg-white shadow-md rounded-lg p-6 font-semibold text-blue-700 hover:bg-blue-200 transition"
              aria-label={`Select ${subj} subject`}
              type="button"
            >
              {subj}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-2">{selectedSubject} Test</h1>

      {!submitted && <Timer duration={25 * 60} onExpire={handleSubmit} />}

      {loading && <p className="mt-8 text-lg text-gray-600">Loading questions...</p>}

      {error && <p className="mt-8 text-lg text-red-600">{error}</p>}

      {!loading && !error && questions.length > 0 && (
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
      )}

      {!submitted && !loading && questions.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-8 px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          type="button"
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
        type="button"
      >
        Back to subjects
      </button>
    </div>
  );
}
