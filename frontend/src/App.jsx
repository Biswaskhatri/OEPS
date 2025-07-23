
// import { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import MainLayout from "./components/layout/MainLayout";

// import HomePage from "./pages/HomePage";
// import AuthPage from "./pages/AuthPage";

// import TestPage from "./pages/TestPage";
// import DailyTestPage from "./pages/DailyTestPage";
// import SubjectTestPage from "./pages/SubjectTestPage";
// import StudentDashboard from "./pages/StudentDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import ResultPage from "./pages/ResultPage"; 

// import EditQuestion from "./components/admin/EditQuestion";

// import PastPapersPage from './components/test/pastPapersPage';

// import PastPaperView from './components/test/PastPaperView';

// export default function App() {
//   // Initialize auth and role from localStorage so user stays logged in on refresh
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     localStorage.getItem("isLoggedIn") === "true"
//   );
//   const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

//   // Logout function clears auth info
//   const logout = () => {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("userEmail");
//     setIsAuthenticated(false);
//     setUserRole(null);
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route
//           element={
//             <MainLayout
//               isAuthenticated={isAuthenticated}
//               setIsAuthenticated={setIsAuthenticated}
//               userRole={userRole}
//               logout={logout}
//             />
//           }
//         >
//         <Route
//             path="/test/past-papers"
//             element={
//               isAuthenticated ? <PastPapersPage /> : <Navigate to="/auth" replace />
//             }
//           />
//           <Route path="/past-paper/:year" element={<PastPaperView />} />

//           <Route path="/" element={<HomePage />} />
//           <Route
//             path="/test"
//             element={
//               isAuthenticated ? <TestPage /> : <Navigate to="/auth" replace />
//             }
//           />
//           <Route
//             path="/test/daily"
//             element={
//               isAuthenticated ? <DailyTestPage /> : <Navigate to="/auth" replace />
//             }
//           />
//           <Route
//             path="/test/subjects"
//             element={
//               isAuthenticated ? (
//                 <SubjectTestPage />
//               ) : (
//                 <Navigate to="/auth" replace />
//               )
//             }
//           />
//            {/* Add this route for ResultPage */}
//           <Route
//             path="/test/result/:resultId"
//             element={
//               isAuthenticated ? (
//                 <ResultPage />
//               ) : (
//                 <Navigate to="/auth" replace />
//               )
//             }
//           />
//           <Route
//             path="/dashboard"
//             element={
//               isAuthenticated && userRole === "admin" ? (
//                 <AdminDashboard />
//               ) : isAuthenticated && userRole === "student" ? ( 
//                 <StudentDashboard />
//               ) : (
//                 <Navigate to="/auth" replace />
//               )
//             }
//           >
            
//             <Route
//               path="questions/:id/edit" 
//               element={<EditQuestion />}
//             />
            
//             <Route index element={
                 
//                  null 
//             }/>
//           </Route>

          
//           <Route
//             path="/dashboard/*" 
//             element={
//               isAuthenticated && userRole === "admin" ? (
//                 <Navigate to="/dashboard" replace /> 
//               ) : (
//                 <Navigate to="/auth" replace /> 
//               )
//             }
//           />

          
//         </Route>

//         <Route
//           path="/auth"
//           element={
//             <AuthPage
//               setIsAuthenticated={setIsAuthenticated}
//               setUserRole={setUserRole}
//             />
//           }
//         />
        
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";

import TestPage from "./pages/TestPage";
import DailyTestPage from "./pages/DailyTestPage";
import SubjectTestPage from "./pages/SubjectTestPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ResultPage from "./pages/ResultPage";

import EditQuestion from "./components/admin/EditQuestion";

import PastPapersPage from './components/test/pastPapersPage';
import PastPaperView from './components/test/PastPaperView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          element={
            <MainLayout
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              userRole={userRole}
              logout={logout}
            />
          }
        >
          <Route
            path="/test/past-papers"
            element={
              isAuthenticated ? <PastPapersPage /> : <Navigate to="/auth" replace />
            }
          />
          <Route path="/past-paper/:year" element={<PastPaperView />} />

          <Route path="/" element={<HomePage />} />

          <Route
            path="/test"
            element={
              isAuthenticated ? <TestPage /> : <Navigate to="/auth" replace />
            }
          />

          <Route
            path="/test/daily"
            element={
              isAuthenticated ? <DailyTestPage /> : <Navigate to="/auth" replace />
            }
          />

          {/* Updated Routes for SubjectTestPage with optional param */}
          <Route
            path="/test/subjects"
            element={
              isAuthenticated ? <SubjectTestPage /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/test/subjects/:subject"
            element={
              isAuthenticated ? <SubjectTestPage /> : <Navigate to="/auth" replace />
            }
          />

          {/* Result page */}
          <Route
            path="/test/result/:resultId"
            element={
              isAuthenticated ? <ResultPage /> : <Navigate to="/auth" replace />
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated && userRole === "admin" ? (
                <AdminDashboard />
              ) : isAuthenticated && userRole === "student" ? (
                <StudentDashboard />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          >
            <Route path="questions/:id/edit" element={<EditQuestion />} />
            <Route index element={null} />
          </Route>

          <Route
            path="/dashboard/*"
            element={
              isAuthenticated && userRole === "admin" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
        </Route>

        <Route
          path="/auth"
          element={
            <AuthPage
              setIsAuthenticated={setIsAuthenticated}
              setUserRole={setUserRole}
            />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
