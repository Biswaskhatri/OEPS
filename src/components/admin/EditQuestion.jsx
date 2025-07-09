import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditQuestion() {
  const { id } = useParams(); // question id from URL param
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    question_id: "",
    question_text: "",
    options: { A: "", B: "", C: "", D: "" },
    correct_option: "",
    subject: "",
    difficulty_level: "",
    topic: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Fetch question data from backend to prefill the form
    fetch(`/api/questions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load question");
        return res.json();
      })
      .then((data) => {
        setFormData({
          question_id: data.question_id,
          question_text: data.question_text,
          options: data.options,
          correct_option: data.correct_option,
          subject: data.subject,
          difficulty_level: data.difficulty_level,
          topic: data.topic || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name.startsWith("options.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        options: { ...prev.options, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "PUT", // or PATCH if backend supports partial update
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update question");
      }

      setSuccessMsg("Question updated successfully!");
      // Optionally redirect after success
      setTimeout(() => navigate("/admin/manage"), 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading question...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Edit Question
      </h2>

      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Question ID</label>
          <input
            type="text"
            name="question_id"
            value={formData.question_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Question Text</label>
          <input
            type="text"
            name="question_text"
            value={formData.question_text}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Options</label>
          <div className="grid grid-cols-2 gap-4">
            {["A", "B", "C", "D"].map((opt) => (
              <input
                key={opt}
                type="text"
                name={`options.${opt}`}
                placeholder={`Option ${opt}`}
                value={formData.options[opt] || ""}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Correct Option</label>
          <select
            name="correct_option"
            value={formData.correct_option}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Choose Correct Option --</option>
            {["A", "B", "C", "D"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Difficulty Level</label>
          <select
            name="difficulty_level"
            value={formData.difficulty_level}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Difficulty --</option>
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Topic</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Question
        </button>
      </form>
    </div>
  );
}
