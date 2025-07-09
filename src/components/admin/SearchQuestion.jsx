import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchQuestion() {
  const [subject, setSubject] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!subject.trim() || !questionId.trim()) {
      setError("Both Subject and Question ID are required");
      return;
    }

    try {
      const res = await fetch("/api/questions/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, question_id: questionId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Question not found");
      }

      // Assuming backend redirects on success; here we get the question _id or URL to redirect
      // If backend does not redirect but returns data, adapt accordingly.

      // For example, backend returns { questionId: '...' }
      const data = await res.json();

      if (data.questionId) {
        navigate(`/admin/edit/${data.questionId}`);
      } else {
        // If backend returns no questionId, just alert or set error
        setError("Question not found or invalid response");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Search Question
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full p-2 border rounded"
            placeholder="Enter subject"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Question ID</label>
          <input
            type="text"
            value={questionId}
            onChange={(e) => setQuestionId(e.target.value)}
            required
            className="w-full p-2 border rounded"
            placeholder="Enter question ID"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Search Question
        </button>
      </form>
    </div>
  );
}
