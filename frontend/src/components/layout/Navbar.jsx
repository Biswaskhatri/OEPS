
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/csitlogo.Png";

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("isLoggedIn"); // Clear login flag
    setIsAuthenticated(false);             // Update auth state
    navigate("/");                         // Redirect to home page
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="CSIT Mock Test Logo" className="h-16 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 font-medium text-gray-700">
          <Link to="/" className="relative group px-1 py-2 hover:text-blue-600">
            Home
            <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-0.5 bg-blue-600 transition-all"></span>
          </Link>
          <Link to="/test" className="relative group px-1 py-2 hover:text-blue-600">
            Test
            <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-0.5 bg-blue-600 transition-all"></span>
          </Link>
          <Link to="/test/subjects" className="relative group px-1 py-2 hover:text-blue-600">
            Subjects
            <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-0.5 bg-blue-600 transition-all"></span>
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="border border-red-600 text-red-600 px-5 py-2 rounded-lg hover:bg-red-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md text-blue-600 hover:bg-blue-100 transition"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-md overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4 space-y-3 font-medium text-gray-700">
          <Link
            to="/"
            className="hover:text-blue-600 transition px-2 py-1 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/test"
            className="hover:text-blue-600 transition px-2 py-1 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            Test
          </Link>
          <Link
            to="/test/subjects"
            className="hover:text-blue-600 transition px-2 py-1 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            Subjects
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-blue-600 px-2 py-1 rounded-md hover:bg-blue-50 transition"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-red-600 px-2 py-1 rounded-md hover:bg-red-50 transition text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="text-blue-600 px-2 py-1 rounded-md hover:bg-blue-50 transition"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </nav>
  );
}
