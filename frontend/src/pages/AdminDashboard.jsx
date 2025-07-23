// import React from "react";
// import AddQuestion from "../components/admin/AddQuestion";
// import DeleteQuestion from "../components/admin/DeleteQuestion";
// import EditQuestion from "../components/admin/EditQuestion";
// import SearchQuestion from "../components/admin/SearchQuestion";

// export default function AdminDashboard() {
//   return (
//     <div className="bg-gray-100 min-h-screen p-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-4xl font-bold text-blue-600 text-center mb-10">
//           Manage CSIT Questions
//         </h1>

//         <AddQuestion />
//         <DeleteQuestion />
//         <EditQuestion />
//         <SearchQuestion />
//       </div>
//     </div>
//   );
// }


// src/components/admin/AdminDashboard.jsx
// src/pages/AdminDashboard.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom"; // Import useLocation

import AddQuestion from "../components/admin/AddQuestion";
import SearchQuestion from "../components/admin/SearchQuestion";

export default function AdminDashboard() {
  const location = useLocation(); // Get the current location object

  // Determine if we are on the base dashboard path (not a nested route)
  // This checks if the current URL pathname is exactly "/dashboard"
  const isBaseDashboardPath = location.pathname === "/dashboard";

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 text-center mb-10">
          Admin Dashboard - Manage Questions
        </h1>

        {/* The Outlet always renders the matched nested route.
            We place it first if we want the nested content to appear at the top. */}
        <Outlet />

        {/* Conditionally render AddQuestion and SearchQuestion only on the base /dashboard path */}
        {isBaseDashboardPath && (
          <>
            <AddQuestion />
            <SearchQuestion />
          </>
        )}
      </div>
    </div>
  );
}