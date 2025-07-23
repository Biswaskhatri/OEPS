
import React, { useState, useEffect, useRef } from "react";
import Timer from "../components/test/Timer";
import { useNavigate, useParams } from "react-router-dom";

// Icons from lucide-react
import {
  Atom,
  Calculator,
  BookOpen,
  FlaskConical,
  MonitorCheck,
} from "lucide-react";

const subjects = [
  { subject: "Physics", icon: Atom },
  { subject: "Chemistry", icon: FlaskConical },
  { subject: "Math", icon: Calculator },
  { subject: "English", icon: BookOpen },
  { subject: "Computer", icon: MonitorCheck },
];

const BASE_URL = "http://localhost:3001";

export default function SubjectTestPage() {
  const navigate = useNavigate();
  const { subject } = useParams();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const startTimeRef = useRef(null);

  // Duration by subject in seconds
  function getDuration(subjectName) {
    switch (subjectName) {
      case "Physics":
      case "Chemistry":
      case "Math":
        return 30 * 60; 
      case "English":
        return 20 * 60; 
      case "Computer":
        return 10 * 60; 
      default:
        return 25 * 60; 
    }
  }

  // Redirect to /auth if not logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  // Fetch questions when subject param changes
  useEffect(() => {
    if (subject) {
      setLoading(true);
      setError(null);
      setAnswers({});
      setSubmitted(false);
      startTimeRef.current = Date.now();

      fetch(`${BASE_URL}/api/test/subject-test?subject=${encodeURIComponent(subject)}`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch questions for ${subject}`);
          return res.json();
        })
        .then((data) => {
          if (data.success && Array.isArray(data.questions)) {
            const formattedQuestions = data.questions.map((q) => ({
              _id: q.question_id || q._id,
              question: q.question_text || q.question,
              options: q.options ? Object.values(q.options) : [],
              correct_answer: q.correct_answer,
              difficulty: q.difficulty,
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
    } else {
      // No subject param - clear test data and show selection
      setQuestions([]);
      setAnswers({});
      setSubmitted(false);
      setLoading(false);
      setError(null);
    }
  }, [subject]);

  const handleAnswer = (qId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [qId]: selectedOption }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    let timeTakenSeconds = 0;
    if (startTimeRef.current) {
      const endTime = Date.now();
      timeTakenSeconds = Math.round((endTime - startTimeRef.current) / 1000);
    }

    const questionsForSubmission = questions.map((q) => ({
      question_id: q._id,
      correct_answer: q.correct_answer,
      difficulty: q.difficulty,
    }));

    try {
      const response = await fetch(`${BASE_URL}/api/test/submit-subject-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          answers,
          questions: questionsForSubmission,
          timeTaken: timeTakenSeconds,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit subject test");
      }

      if (data.success && data.resultId) {
        setSubmitted(true);
        navigate(`/test/result/${data.resultId}`);
      } else {
        setError(data.message || "Subject test submitted, but no result ID received.");
      }
    } catch (err) {
      console.error("Error submitting subject test:", err);
      setError(err.message || "An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  // When user clicks a subject, navigate to URL with subject param
  const handleSelectSubject = (subj) => {
    navigate(`/test/subjects/${subj}`);
  };

  if (!subject) {
    // Show subject selection screen
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold text-gray-800 py-4">Choose a Subject</h1>
        <div className="max-w-2xl mx-auto text-center mb-6 px-4">
          <p className="text-gray-700 text-lg mx-5 my-5 leading-relaxed font-medium">
            Select a subject below to start your subject-wise test.
Each test is designed to help you improve in that specific area.


          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {subjects.map(({ subject, icon: Icon }) => (
            <button
              key={subject}
              onClick={() => handleSelectSubject(subject)}
              className="bg-white shadow-md rounded-xl p-8 font-semibold text-blue-700 hover:bg-blue-200 transition flex flex-col items-center space-y-4 w-full max-w-xs mx-auto"
              aria-label={`Select ${subject} subject`}
              type="button"
            >
              <Icon className="w-12 h-12 text-blue-600" />
              <span className="text-xl">{subject}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Show test UI for the selected subject
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-2">{subject} Test</h1>

      {!submitted && !loading && (
        <Timer duration={getDuration(subject)} onExpire={handleSubmit} />
      )}

      {loading && <p className="mt-8 text-lg text-gray-600">Loading...</p>}

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

      {submitted && !loading && !error && (
        <div className="mt-8 p-4 bg-green-100 text-green-800 rounded font-semibold text-center">
          Test submitted successfully. Redirecting to results...
        </div>
      )}

      <button
        onClick={() => navigate("/test/subjects")}
        className="mt-4 text-sm text-blue-600 underline"
        type="button"
      >
        Back to subjects
      </button>
    </div>
  );
}
