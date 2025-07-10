// export default function SubjectCard({ subject, description }) {
//   return (
//     // <div className="bg-white p-7 border border-gray-200 rounded-xl shadow hover:shadow-md transition">
//      <div className="bg-white rounded-2xl shadow-md p-6 text-center h-full w-full flex flex-col items-center justify-start transition hover:shadow-xl">
//       <h3 className="text-xl font-semibold text-blue-700 mb-2">{subject}</h3>
    
//     </div>
//   );
// }


export default function SubjectCard({ subject, description, Icon }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {Icon && <Icon className="w-10 h-10 text-blue-600 mb-4 mx-auto" />}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{subject}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
