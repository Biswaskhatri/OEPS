
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

export default function App() {
  // Initialize auth and role from localStorage so user stays logged in on refresh
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  // Logout function clears auth info
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
          <Route
            path="/test/subjects"
            element={
              isAuthenticated ? (
                <SubjectTestPage />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
           {/* Add this route for ResultPage */}
          <Route
            path="/test/result/:resultId"
            element={
              isAuthenticated ? (
                <ResultPage />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                userRole === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <StudentDashboard />
                )
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
      </Routes>
    </Router>
  );
}
