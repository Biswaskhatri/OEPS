import React, { useState, useEffect } from "react";
import Timer from "../components/test/Timer";

export default function DailyTestPage() {
  const [testStarted, setTestStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL =  "http://localhost:3001";

  useEffect(() => {
    // Automatically start test when page loads
    setTestStarted(true);
  }, []);

  useEffect(() => {
    if (testStarted) {
      setLoading(true);
    
      fetch(`${BASE_URL}/api/test/start-test`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((data) => {
          setQuestions(data.questions || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch questions:", err);
          alert("Failed to load questions. Please try again later.");
          setLoading(false);
        });
    }
  }, [testStarted]);

  const handleAnswer = (qId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [qId]: selectedOption }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      if (!window.confirm("You have unanswered questions. Submit anyway?")) return;
    }

    setSubmitted(true);

    fetch(`${BASE_URL}/api/test/submit-test`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Submit failed");
        return res.json();
      })
      .then((data) => {
        alert("Test submitted! Thank you.");
        console.log("Submission response:", data);
      })
      .catch((err) => {
        console.error("Submit error:", err);
        alert("Failed to submit test. Please try again.");
        setSubmitted(false);
      });
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-2">Daily Mixed Test</h1>

      {!submitted && <Timer duration={7200} onExpire={handleSubmit} />}

      {loading ? (
        <p className="mt-8 text-lg text-gray-600">Loading questions...</p>
      ) : Array.isArray(questions) && questions.length > 0 ? (
        <div className="mt-8 space-y-6 w-full max-w-3xl">
          {questions.map(({ question_id, question_text, options }, index) => (
            <div
              key={question_id}
              className="bg-white p-6 rounded-lg shadow-md mx-auto max-w-xl"
            >
              <p className="font-semibold mb-4 text-lg flex items-start">
                <span className="font-bold mr-3 min-w-[2.5rem] text-left">
                  Q{index + 1}.
                </span>
                <span className="flex-1">{question_text}</span>
              </p>
              <div className="flex flex-col space-y-3">
                {Object.entries(options).map(([key, value]) => (
                  <label
                    key={key}
                    className="cursor-pointer border border-gray-300 rounded px-4 py-2 flex items-center space-x-3 hover:border-blue-500 transition"
                  >
                    <input
                      type="radio"
                      name={`question-${question_id}`}
                      value={key}
                      disabled={submitted}
                      checked={answers[question_id] === key}
                      onChange={() => handleAnswer(question_id, key)}
                      className="form-radio text-blue-600"
                    />
                    <span>{key}. {value}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-lg text-gray-600">No questions available.</p>
      )}

      {!submitted && !loading && questions.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-8 px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
        >
          Submit Test
        </button>
      )}

      {submitted && (
        <div className="mt-8 p-4 bg-green-100 text-green-800 rounded font-semibold text-center">
          Thank you for submitting the test.
        </div>
      )}
    </div>
  );
}
