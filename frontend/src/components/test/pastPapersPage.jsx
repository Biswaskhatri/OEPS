



// import React, { useState } from 'react';
// import { ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const questionPapersData = [
//   {
//     id: 1,
//     title: '2080 Question Paper',
//     type: 'pdf',
//     filePath: '/question_papers/bsccsit-2080.pdf',
//   },
//   {
//     id: 2,
//     title: '2079 Question Paper',
//     type: 'pdf',
//     filePath: '/question_papers/csit 2079.pdf',
//   },
//   {
//     id: 3,
//     title: '2078 Question Paper',
//     type: 'pdf',
//     filePath: '/question_papers/csit 2078.pdf',
//   },
// ];

// const PastPapersPage = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const navigate = useNavigate();

//   const handlePaperClick = (filePath) => {
//     setSelectedFile(filePath);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-100">
//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
//         <div className="flex items-center gap-2 mb-6">
//           <ArrowLeft
//             className="cursor-pointer hover:text-blue-600"
//             onClick={() => navigate('/dashboard')}
//           />
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Past Question Papers
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {questionPapersData.map((paper) => (
//             <button
//               key={paper.id}
//               onClick={() => handlePaperClick(paper.filePath)}
//               className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all"
//             >
//               <span className="font-medium text-blue-700">{paper.title}</span>
//             </button>
//           ))}
//         </div>

//         {selectedFile && (
//           <div className="mt-8">
//             <h3 className="text-lg font-semibold text-gray-700 mb-2">
//               Preview:
//             </h3>
//             <div className="w-full h-[600px] border rounded-lg overflow-hidden">
//               <iframe
//                 title="PDF Viewer"
//                 src={selectedFile}
//                 className="w-full h-full"
//               ></iframe>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PastPapersPage;




import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const questionPapersData = [
  { id: 1, title: '2080 Question Paper', year: '2080', filePath: '/question_papers/bsccsit-2080.pdf' },
  { id: 2, title: '2079 Question Paper', year: '2079', filePath: '/question_papers/csit 2079.pdf' },
  { id: 3, title: '2078 Question Paper', year: '2078', filePath: '/question_papers/csit 2078.pdf' },
];

const PastPapersPage = () => {
  const navigate = useNavigate();

  const handlePaperClick = (year) => {
    navigate(`/past-paper/${year}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <ArrowLeft
            className="cursor-pointer hover:text-blue-600"
            onClick={() => navigate('/test')}
          />
          <h2 className="text-2xl font-semibold text-gray-800">Past Question Papers</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {questionPapersData.map((paper) => (
            <button
              key={paper.id}
              onClick={() => handlePaperClick(paper.year)}
              className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all"
            >
              <span className="font-medium text-blue-700">{paper.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PastPapersPage;

