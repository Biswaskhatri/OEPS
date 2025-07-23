// import { useState } from "react";

// export default function AddQuestion() {
//   const [formData, setFormData] = useState({
//     question_id: "",
//     question_text: "",
//     options: { A: "", B: "", C: "", D: "" },
//     correct_option: "",
//     subject: "",
//     difficulty_level: "",
//     topic: "",
//   });

//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith("options.")) {
//       const key = name.split(".")[1];
//       setFormData((prev) => ({
//         ...prev,
//         options: { ...prev.options, [key]: value },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       const response = await fetch("http://localhost:3001/api/questions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//          credentials: "include",
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         setMessage("✅ Question added successfully!");
//         setFormData({
//           question_id: "",
//           question_text: "",
//           options: { A: "", B: "", C: "", D: "" },
//           correct_option: "",
//           subject: "",
//           difficulty_level: "",
//           topic: "",
//         });
//       } else {
//         setMessage("❌ Error: " + result.error || "Something went wrong.");
//       }
//     } catch (err) {
//       setMessage("❌ Error: " + err.message);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-bold mb-4">Add Question</h2>
//       {message && <p className="mb-2 text-sm text-center text-green-600">{message}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input type="text" name="question_id" placeholder="Question ID" value={formData.question_id} onChange={handleChange} className="w-full p-2 border rounded" required />
//         <input type="text" name="question_text" placeholder="Question Text" value={formData.question_text} onChange={handleChange} className="w-full p-2 border rounded" required />

//         <div className="grid grid-cols-2 gap-4">
//           {["A", "B", "C", "D"].map((opt) => (
//             <input key={opt} type="text" name={`options.${opt}`} placeholder={`Option ${opt}`} value={formData.options[opt]} onChange={handleChange} className="p-2 border rounded" required />
//           ))}
//         </div>

//         <select name="correct_option" value={formData.correct_option} onChange={handleChange} className="w-full p-2 border rounded" required>
//           <option value="">-- Correct Option --</option>
//           {["A", "B", "C", "D"].map((opt) => (
//             <option key={opt} value={opt}>{opt}</option>
//           ))}
//         </select>

//         <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className="w-full p-2 border rounded" required />

//         <select name="difficulty_level" value={formData.difficulty_level} onChange={handleChange} className="w-full p-2 border rounded" required>
//           <option value="">-- Difficulty --</option>
//           <option value="Basic">Basic</option>
//           <option value="Intermediate">Intermediate</option>
//           <option value="Hard">Hard</option>
//         </select>

//         <input type="text" name="topic" placeholder="Topic" value={formData.topic} onChange={handleChange} className="w-full p-2 border rounded" />

//         <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Question</button>
//       </form>
//     </div>
//   );
// }



// src/components/admin/AddQuestion.jsx
import React, { useState } from "react";
import SUBJECTS from "../../constants/subjects"; // Import the subjects array

export default function AddQuestion() {
  const [formData, setFormData] = useState({
    question_id: "",
    question_text: "",
    options: { A: "", B: "", C: "", D: "" },
    correct_option: "",
    subject: "", // Initialize as empty string for the dropdown
    difficulty_level: "",
    topic: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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
    setMessage("");
    setIsSuccess(false);

    try {
      const response = await fetch("http://localhost:3001/api/addQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(result.message || "Question added successfully!");
        // Clear form after successful submission
        setFormData({
          question_id: "",
          question_text: "",
          options: { A: "", B: "", C: "", D: "" },
          correct_option: "",
          subject: "",
          difficulty_level: "",
          topic: "",
        });
      } else {
        setIsSuccess(false);
        setMessage(result.message || "Failed to add question.");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("Network error: " + error.message);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md mt-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Add New Question
      </h2>

      {message && (
        <p className={`mb-4 text-center ${isSuccess ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Question ID </label>
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
          <textarea
            name="question_text"
            value={formData.question_text}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded resize-y"
            rows="3"
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
            <option value=""> Choose Correct Option </option>
            {["A", "B", "C", "D"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Subject</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value=""> Select Subject </option>
            {SUBJECTS.map((sub) => ( // Use the SUBJECTS array here
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
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
            <option value="">Select Difficulty </option>
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Topic (Optional)</label>
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
          Add Question
        </button>
      </form>
    </div>
  );
}