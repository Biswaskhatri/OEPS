import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const fileMap = {
  '2080': '/question_papers/bsccsit-2080.pdf',
  '2079': '/question_papers/csit 2079.pdf',
  '2078': '/question_papers/csit 2078.pdf',
};

const PastPaperView = () => {
  const { year } = useParams();
  const navigate = useNavigate();
  const filePath = fileMap[year];

  if (!filePath) {
    return <div className="text-center mt-20 text-xl text-red-500">Paper not found</div>;
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex items-center gap-3 p-4 shadow border-b">
        <ArrowLeft
        className="cursor-pointer hover:text-blue-600"
        onClick={() => navigate(-1)}  
      />
        <h2 className="text-xl font-semibold text-gray-800">{year} Question Paper</h2>
      </div>

      <div className="flex-1">
        <iframe
          title={`${year} PDF`}
          src={filePath}
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default PastPaperView;
