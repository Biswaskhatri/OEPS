// import { useState } from "react";

// export default function DeleteQuestion() {
//   const [questionId, setQuestionId] = useState("");
//   const [deleteStatus, setDeleteStatus] = useState("");

//   const handleDelete = async (e) => {
//     e.preventDefault();
//     setDeleteStatus("");

//     if (!questionId.trim()) {
//       setDeleteStatus("❌ Please enter a question ID.");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:3001/api/questions/${questionId}`, {
//         method: "DELETE",
//          credentials: "include",
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setDeleteStatus("✅ Question deleted successfully!");
//         setQuestionId(""); // Clear input
//       } else {
//         setDeleteStatus("❌ Failed to delete: " + (data.message || data.error));
//       }
//     } catch (err) {
//       setDeleteStatus("❌ Network error: " + err.message);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-xl font-bold mb-4 text-center text-red-600">Delete Question</h2>

//       {deleteStatus && <p className="mb-4 text-sm text-center">{deleteStatus}</p>}

//       <form onSubmit={handleDelete} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Enter Question ID (MongoDB _id)"
//           value={questionId}
//           onChange={(e) => setQuestionId(e.target.value)}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
//         >
//           Delete Question
//         </button>
//       </form>
//     </div>
//   );
// }



// DeleteQuestion.jsx
import { useState } from "react";

export default function DeleteQuestion() {
  const [questionId, setQuestionId] = useState("");
  const [deleteStatus, setDeleteStatus] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteStatus("");

    if (!questionId.trim()) {
      setDeleteStatus("❌ Please enter a question ID.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/questions/${questionId}`, { // Ensure this matches your backend route
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json(); // Always try to parse JSON response

      if (response.ok) {
        setDeleteStatus("✅ Question deleted successfully!");
        setQuestionId(""); // Clear input
      } else {
        setDeleteStatus("❌ Failed to delete: " + (data.message || data.error || "Unknown error"));
      }
    } catch (err) {
      setDeleteStatus("❌ Network error: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg mb-8">
      <h2 className="text-xl font-bold mb-4 text-center text-red-600">Delete Question</h2>

      {deleteStatus && <p className={`mb-4 text-sm text-center ${deleteStatus.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{deleteStatus}</p>}

      <form onSubmit={handleDelete} className="space-y-4">
        <input
          type="text"
          placeholder="Enter Question ID (MongoDB _id)"
          value={questionId}
          onChange={(e) => setQuestionId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Delete Question
        </button>
      </form>
    </div>
  );
}
