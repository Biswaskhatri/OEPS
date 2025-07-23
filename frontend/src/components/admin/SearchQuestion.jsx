// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function SearchQuestion() {
//   const [subject, setSubject] = useState("");
//   const [questionId, setQuestionId] = useState("");
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError(null);

//     if (!subject.trim() || !questionId.trim()) {
//       setError("Both Subject and Question ID are required");
//       return;
//     }

//     try {
//       const res = await fetch("/api/questions/find", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//          credentials: "include",
//         body: JSON.stringify({ subject, question_id: questionId }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Question not found");
//       }

     
//       const data = await res.json();

//       if (data.questionId) {
//         navigate(`/admin/edit/${data.questionId}`);
//       } else {
//         // If backend returns no questionId, just alert or set error
//         setError("Question not found or invalid response");
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8">
//       <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
//         Search Question
//       </h2>

//       {error && <p className="text-red-600 mb-4">{error}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block font-medium mb-1">Subject</label>
//           <input
//             type="text"
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             required
//             className="w-full p-2 border rounded"
//             placeholder="Enter subject"
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Question ID</label>
//           <input
//             type="text"
//             value={questionId}
//             onChange={(e) => setQuestionId(e.target.value)}
//             required
//             className="w-full p-2 border rounded"
//             placeholder="Enter question ID"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
//         >
//           Search Question
//         </button>
//       </form>
//     </div>
//   );
// }






// src/components/admin/SearchQuestion.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SUBJECTS from "../../constants/subjects"; // Import the subjects array

export default function SearchQuestion() {
  const [searchSubject, setSearchSubject] = useState("");
  const [searchQuestionId, setSearchQuestionId] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSearch(e) {
    e.preventDefault();
    setMessage("");
    setSearchResults([]); // Clear previous results

    if (!searchSubject && !searchQuestionId) {
      setMessage("Please enter a Subject or Question ID to search.");
      return;
    }

    try {
      let url = `http://localhost:3001/api/questions/search?`;
      if (searchSubject) {
        url += `subject=${encodeURIComponent(searchSubject)}`;
      }
      if (searchQuestionId) {
        url += `${searchSubject ? '&' : ''}question_id=${encodeURIComponent(searchQuestionId)}`;
      }

      const response = await fetch(url, {
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        if (result.questions && result.questions.length > 0) {
          setSearchResults(result.questions);
          setMessage(`Found ${result.questions.length} question(s).`);
        } else {
          setMessage("No questions found matching your criteria.");
        }
      } else {
        setMessage(result.message || "Failed to search questions.");
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }
  }

  // New function to handle redirecting to the Edit page
  const handleEditRedirect = (questionMongoId) => {
    navigate(`/dashboard/questions/${questionMongoId}/edit`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Search Questions to Edit/Delete
      </h2>

      <form onSubmit={handleSearch} className="space-y-4 mb-6">
        <div>
          <label className="block font-medium mb-1">Subject</label>
          <select
            name="searchSubject"
            value={searchSubject}
            onChange={(e) => setSearchSubject(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value=""> All Subjects </option>
            {SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Question ID</label>
          <input
            type="text"
            name="searchQuestionId"
            placeholder=""
            value={searchQuestionId}
            onChange={(e) => setSearchQuestionId(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {message && (
        <p className={`mb-4 text-center ${searchResults.length > 0 ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      {searchResults.length > 0 && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Search Results:</h3>
          <ul className="space-y-3">
            {searchResults.map((question) => (
              <li
                key={question._id}
                className="p-4 border rounded bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    ID: {question.question_id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Subject: {question.subject}
                  </p>
                  <p className="text-sm text-gray-700">
                    "{question.question_text.substring(0, 70)}..."
                  </p>
                </div>
                <button
                  onClick={() => handleEditRedirect(question._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ml-4"
                >
                  Edit/View Details
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}