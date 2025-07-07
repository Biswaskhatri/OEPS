// // import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import MainLayout from "./components/layout/MainLayout";

// import HomePage from "./pages/HomePage";
// import AuthPage from "./pages/AuthPage";

// import TestPage from "./pages/TestPage";
// import DailyTestPage from "./pages/DailyTestPage";
// import SubjectTestPage from "./pages/SubjectTestPage";
// import Dashpage from "./pages/Dashpage";

// export default function App() {
//    const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const loggedIn = localStorage.getItem("isLoggedIn") === "true";
//     setIsAuthenticated(loggedIn);
//   }, []);
//   return (
//     <Router>
//        <Route
//           element={<MainLayout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
//         >
//           <Route path="/" element={<HomePage />} />
          
          
//            <Route path="/test" element={<TestPage />} />
//           <Route path="/test/daily" element={<DailyTestPage />} />
//            <Route path="/test/subjects" element={<SubjectTestPage />} /> 

//           <Route path="/dashboard" element={<Dashpage />} />
//         </Route>

//          <Route path="/auth" element={<AuthPage setIsAuthenticated={setIsAuthenticated} />} />
//       </Routes>
//     </Router>
//   );
// }
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";

import TestPage from "./pages/TestPage";
import DailyTestPage from "./pages/DailyTestPage";
import SubjectTestPage from "./pages/SubjectTestPage";
import Dashpage from "./pages/Dashpage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(loggedIn);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Pass auth props to MainLayout */}
        <Route
          element={<MainLayout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/test/daily" element={<DailyTestPage />} />
          <Route path="/test/subjects" element={<SubjectTestPage />} />
          <Route path="/dashboard" element={<Dashpage />} />
        </Route>

        {/* Auth page gets setIsAuthenticated to update on login */}
        <Route path="/auth" element={<AuthPage setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </Router>
  );
}
