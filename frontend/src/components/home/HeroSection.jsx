import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/mocktestpic.svg"; // use any mock test-related image


export default function HeroSection() {
  const navigate = useNavigate();
  
function handleStartTest() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (isLoggedIn) {
    navigate("/test");
  } else {
    navigate("/auth");
  }
}

  
  return (
    <section className="bg-blue-50 py-16 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">

        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Welcome to CSIT Mock Test Portal
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Prepare smartly for your CSIT entrance with subject-wise mock tests,
            personalized dashboard, and detailed progress tracking.
          </p>

          <button
            onClick={handleStartTest}
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Take Test
          </button>
        </div>

        <div className="flex justify-center">
          <img
            src={heroImage}
            alt="Mock test illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
}
