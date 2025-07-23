
// import React, { useState, useEffect } from "react";
// import Timer from "../components/test/Timer";
// import { useNavigate } from "react-router-dom"; 

// export default function DailyTestPage() {
//   const navigate = useNavigate();  
//   const [testStarted, setTestStarted] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [answers, setAnswers] = useState({});
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const BASE_URL = "http://localhost:3001";

//   useEffect(() => {
//     setTestStarted(true);
//   }, []);

//   useEffect(() => {
//     if (testStarted) {
//       setLoading(true);
//       fetch(`${BASE_URL}/api/test/start-test`, {
//         method: "GET",
//         credentials: "include",
//       })
//         .then((res) => {
//           if (!res.ok) throw new Error("Network response was not ok");
//           return res.json();
//         })
//         .then((data) => {
//           setQuestions(data.questions || []);
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error("Failed to fetch questions:", err);
//           setLoading(false);
//         });
//     }
//   }, [testStarted]);

//   const handleAnswer = (qId, selectedOption) => {
//     setAnswers((prev) => ({ ...prev, [qId]: selectedOption }));
//   };

//   const handleSubmit = () => {
//      setSubmitted(true); 
//     setLoading(true); 
//     setError(null);

//     const allQuestionIds = questions.map(q => q.question_id);


//     fetch(`${BASE_URL}/api/test/submit-test`, {
//       method: "POST",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         answers: answers, 
//         allPresentedQuestionIds: allQuestionIds 
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Submit failed");
//         return res.json();
//       })
//       .then((data) => {
//         if (data.resultId) {
//           navigate(`/test/result/${data.resultId}`);
//         } else {
//           navigate("/test/result");
//         }
//       })
//       .catch((err) => {
//         console.error("Submit error:", err);
//         setSubmitted(false);
//       });
//   };

//   // ✨ Logic for unanswered question count
//   const unansweredCount = questions.length - Object.keys(answers).length;
//   const hasUnanswered = unansweredCount > 0;

//   return (
//     <div className="min-h-screen bg-blue-100 flex flex-col items-center p-6">
//       <h1 className="text-3xl font-bold mb-2">Mock Test</h1>

//       {!submitted && <Timer duration={7200} onExpire={handleSubmit} />}

//       {loading ? (
//         <p className="mt-8 text-lg text-gray-600">Loading questions...</p>
//       ) : Array.isArray(questions) && questions.length > 0 ? (
//         <div className="mt-8 space-y-6 w-full max-w-3xl">
//           {questions.map(({ question_id, question_text, options }, index) => (
//             <div
//               key={question_id}
//               className="bg-white p-6 rounded-lg shadow-md mx-auto max-w-xl"
//             >
//               <p className="font-semibold mb-4 text-lg flex items-start">
//                 <span className="font-bold mr-3 min-w-[2.5rem] text-left">
//                   Q{index + 1}.
//                 </span>
//                 <span className="flex-1">{question_text}</span>
//               </p>
//               <div className="flex flex-col space-y-3">
//                 {Object.entries(options).map(([key, value]) => (
//                   <label
//                     key={key}
//                     className="cursor-pointer border border-gray-300 rounded px-4 py-2 flex items-center space-x-3 hover:border-blue-500 transition"
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${question_id}`}
//                       value={key}
//                       disabled={submitted}
//                       checked={answers[question_id] === key}
//                       onChange={() => handleAnswer(question_id, key)}
//                       className="form-radio text-blue-600"
//                     />
//                     <span>{key}. {value}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="mt-8 text-lg text-gray-600">No questions available.</p>
//       )}

//       {!submitted && !loading && questions.length > 0 && (
//         <>
//           {/* 👇 Show warning message if any questions are unanswered */}
//           {hasUnanswered && (
//             <p className="mt-4 text-yellow-600 font-medium text-center">
//               You have {unansweredCount} unanswered question
//               {unansweredCount > 1 ? "s" : ""}.
//             </p>
//           )}

//           <button
//             onClick={handleSubmit}
//             className="mt-4 px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
//           >
//             Submit Test
//           </button>
//         </>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import Timer from "../components/test/Timer";
import { useNavigate } from "react-router-dom";

export default function DailyTestPage() {
  const navigate = useNavigate();
  const [testStarted, setTestStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({}); // { question_id: selected_option }
  const [questions, setQuestions] = useState([]); // Array of question objects
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false); // <--- NEW: For fetching questions
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);   // <--- NEW: For submitting test
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:3001"; // Your backend URL

  // Effect to start the test (runs once on mount)
  useEffect(() => {
    setTestStarted(true);
  }, []);

  // Effect to fetch questions when testStarted is true
  useEffect(() => {
    if (testStarted) {
      setIsLoadingQuestions(true); // Set loading for questions
      setError(null); // Clear previous errors
      fetch(`${BASE_URL}/api/test/start-test`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            // Attempt to read error message from response body
            return res.json().then(errData => {
              throw new Error(errData.message || "Network response was not ok");
            });
          }
          return res.json();
        })
        .then((data) => {
          // Assuming data.questions is an array of 100 question objects
          if (data.questions && data.questions.length === 100) {
            setQuestions(data.questions);
          } else {
            // Handle case where fewer/more than 100 questions are returned
            console.warn(`Expected 100 questions, but received ${data.questions ? data.questions.length : 0}.`);
            setQuestions(data.questions || []);
          }
          setIsLoadingQuestions(false); // End loading for questions
        })
        .catch((err) => {
          console.error("Failed to fetch questions:", err);
          setError(err.message || "Failed to load test questions.");
          setIsLoadingQuestions(false); // End loading for questions
        });
    }
  }, [testStarted]); // Dependency array: runs when testStarted changes

  const handleAnswer = (qId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [qId]: selectedOption }));
  };

  const handleSubmit = () => {
    setSubmitted(true); // Disable further interaction (questions, timer)
    setIsSubmittingTest(true); // <--- Set submitting state
    setError(null); // Clear previous errors

    // Extract all question IDs from the 'questions' state
    const allQuestionIds = questions.map(q => q.question_id); // This is correct

    fetch(`${BASE_URL}/api/test/submit-test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        answers: answers, // User's submitted answers (only for attempted questions)
        allPresentedQuestionIds: allQuestionIds // Send ALL 100 question IDs here
      }),
    })
      .then((res) => {
        if (!res.ok) {
          // Attempt to read error message from response body
          return res.json().then(errData => {
            throw new Error(errData.message || "Submit failed");
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.resultId) {
          navigate(`/test/result/${data.resultId}`);
        } else {
          navigate("/test/result"); // Fallback if resultId is not provided
        }
      })
      .catch((err) => {
        console.error("Submit error:", err);
        setError(err.message || "Failed to submit test.");
        setSubmitted(false); // Re-enable interaction if submission failed
      })
      .finally(() => {
        setIsSubmittingTest(false); // <--- End submitting state
      });
  };

  // ✨ Logic for unanswered question count
  const unansweredCount = questions.length - Object.keys(answers).length;
  const hasUnanswered = unansweredCount > 0;

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center p-6">

    <div className="min-h-screen bg-blue-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-2">Mock Test</h1>

      {/* Timer should be hidden if test is submitted or currently submitting */}
      {!submitted && !isSubmittingTest && <Timer duration={7200} onExpire={handleSubmit} />}

      {/* Conditional rendering for loading, error, or questions */}
      {isLoadingQuestions ? ( // <--- Use isLoadingQuestions here
        <p className="mt-8 text-lg text-gray-600">Loading questions...</p>
      ) : isSubmittingTest ? ( // <--- Use isSubmittingTest here for submission message
        <p className="mt-8 text-lg text-blue-600 font-semibold">Submitting your test...</p>
      ) : error ? ( // Display error message if any
        <p className="mt-8 text-lg text-red-600">Error: {error}</p>
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
                      disabled={submitted || isSubmittingTest} // Disable if submitted or submitting
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
        <p className="mt-8 text-lg text-gray-600">No questions available. Please refresh or try again later.</p>
      )}

      {/* Submit button and unanswered warning */}
      {/* Button should be visible if not submitted, not loading questions, and questions are available */}
      {!submitted && !isLoadingQuestions && questions.length > 0 && (
        <>
          {hasUnanswered && (
            <p className="mt-4 text-yellow-600 font-medium text-center">
              You have {unansweredCount} unanswered question
              {unansweredCount > 1 ? "s" : ""}.
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmittingTest} // Disable button only if currently submitting
            className="mt-4 px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          >
            {isSubmittingTest ? "Submitting..." : "Submit Test"} {/* Change button text */}
          </button>
        </>
      )}
    </div>

    
    </div>
  );
}

