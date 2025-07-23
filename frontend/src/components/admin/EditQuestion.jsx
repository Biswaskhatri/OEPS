// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// export default function EditQuestion() {
//   const { id } = useParams(); // question id from URL param
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     question_id: "",
//     question_text: "",
//     options: { A: "", B: "", C: "", D: "" },
//     correct_option: "",
//     subject: "",
//     difficulty_level: "",
//     topic: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState("");

//   useEffect(() => {
//     // Fetch question data from backend to prefill the form
//     fetch(`/api/questions/${id}`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to load question");
//         return res.json();
//       })
//       .then((data) => {
//         setFormData({
//           question_id: data.question_id,
//           question_text: data.question_text,
//           options: data.options,
//           correct_option: data.correct_option,
//           subject: data.subject,
//           difficulty_level: data.difficulty_level,
//           topic: data.topic || "",
//         });
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, [id]);

//   function handleChange(e) {
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
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError(null);
//     setSuccessMsg("");

//     try {
//       const res = await fetch(`/api/questions/${id}`, {
//         method: "PUT", // or PATCH if backend supports partial update
//         headers: { "Content-Type": "application/json" },
//          credentials: "include",
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to update question");
//       }

//       setSuccessMsg("Question updated successfully!");
//       // Optionally redirect after success
//       setTimeout(() => navigate("/admin/manage"), 2000);
//     } catch (err) {
//       setError(err.message);
//     }
//   }

//   if (loading) return <p>Loading question...</p>;
//   if (error) return <p className="text-red-600">Error: {error}</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
//       <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
//         Edit Question
//       </h2>

//       {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block font-medium mb-1">Question ID</label>
//           <input
//             type="text"
//             name="question_id"
//             value={formData.question_id}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Question Text</label>
//           <input
//             type="text"
//             name="question_text"
//             value={formData.question_text}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Options</label>
//           <div className="grid grid-cols-2 gap-4">
//             {["A", "B", "C", "D"].map((opt) => (
//               <input
//                 key={opt}
//                 type="text"
//                 name={`options.${opt}`}
//                 placeholder={`Option ${opt}`}
//                 value={formData.options[opt] || ""}
//                 onChange={handleChange}
//                 required
//                 className="p-2 border rounded"
//               />
//             ))}
//           </div>
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Correct Option</label>
//           <select
//             name="correct_option"
//             value={formData.correct_option}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded"
//           >
//             <option value="">-- Choose Correct Option --</option>
//             {["A", "B", "C", "D"].map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Subject</label>
//           <input
//             type="text"
//             name="subject"
//             value={formData.subject}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Difficulty Level</label>
//           <select
//             name="difficulty_level"
//             value={formData.difficulty_level}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded"
//           >
//             <option value="">-- Select Difficulty --</option>
//             <option value="Basic">Basic</option>
//             <option value="Intermediate">Intermediate</option>
//             <option value="Hard">Hard</option>
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Topic</label>
//           <input
//             type="text"
//             name="topic"
//             value={formData.topic}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         >
//           Update Question
//         </button>
//       </form>
//     </div>
//   );
// }




// src/components/admin/EditQuestion.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SUBJECTS from "../../constants/subjects"; // Import subjects for the dropdown

export default function EditQuestion() {
  const { id } = useParams(); // Get question ID directly from the URL parameter
  const navigate = useNavigate(); // For optional redirection after successful update/delete

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
    if (!id) {
      setError("No question ID provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchQuestion = async () => {
      setLoading(true);
      setError(null);
      setSuccessMsg("");
      try {
        const res = await fetch(`http://localhost:3001/api/questions/${id}`, {
          credentials: "include",
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Failed to load question");
        }

        setFormData({
          question_id: result.question.question_id || "",
          question_text: result.question.question_text || "",
          options: result.question.options || { A: "", B: "", C: "", D: "" },
          correct_option: result.question.correct_option || "",
          subject: result.question.subject || "",
          difficulty_level: result.question.difficulty_level || "",
          topic: result.question.topic || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
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
      const res = await fetch(`http://localhost:3001/api/questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update question");
      }

      setSuccessMsg("✅ Question updated successfully!");
      setTimeout(() => {
        navigate("/dashboard"); // Navigate back to the main admin dashboard after update
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return;
    }
    setError(null);
    setSuccessMsg("");

    try {
      const res = await fetch(`http://localhost:3001/api/questions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete question");
      }

      setSuccessMsg("🗑️ Question deleted successfully!");
      // After deletion, navigate back to the main dashboard or search
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-center text-blue-500 mt-8">Loading question details...</p>;
  if (error) return <p className="text-center text-red-600 mt-8">Error: {error}</p>;
  if (!id) return <p className="text-center text-gray-600 mt-8">No question selected for editing. Please use the search functionality.</p>

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Edit Question ({formData.question_id})
      </h2>

      {successMsg && <p className="text-green-600 mb-4 text-center">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Question ID</label>
          <input
            type="text"
            name="question_id"
            value={formData.question_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-gray-50 cursor-not-allowed"
            readOnly
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Question Text</label>
          <textarea
            name="question_text"
            value={formData.question_text}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded resize-y" rows="3"
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
          <select // Changed to select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Subject --</option>
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

        <div className="flex justify-between gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Update Question
            </button>
            <button
              type="button" // Important: type="button" to prevent form submission
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              Delete Question
            </button>
        </div>
      </form>
    </div>
  );
}