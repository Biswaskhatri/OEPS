
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { User, UserCheck, Mail, Lock } from "lucide-react";
import googleIcon from "../assets/googleicon.png";
import { useNavigate } from "react-router-dom";

function InputWithIcon({ icon: Icon, value, onChange, ...rest }) {
  return (
    <div className="relative">
      <Icon
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        value={value}
        onChange={onChange}
        {...rest}
        className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default function AuthPage({ setIsAuthenticated, setUserRole }) {
  const [isLogin, setIsLogin] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType] = useState("student");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:3001";

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      alert("Google login successful! Token: " + tokenResponse.access_token);
      // You can add backend login with Google token here
    },
    onError: () => {
      alert("Google login failed!");
    },
  });

  function validatePassword(pw) {
    const uppercase = /[A-Z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    return uppercase.test(pw) && number.test(pw) && specialChar.test(pw);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (!isLogin) {
      if (!firstName.trim()) newErrors.firstName = "First name is required";
      if (!lastName.trim()) newErrors.lastName = "Last name is required";

      if (!validatePassword(password))
        newErrors.password =
          "Password must contain at least one uppercase letter, one number, and one special character.";

      if (password !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";

      if (!acceptedTerms)
        newErrors.acceptedTerms = "Please accept the terms and conditions";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
    }

    const endpoint = isLogin
      ? `${BASE_URL}/api/login`
      : `${BASE_URL}/api/signup`;

    const payload = isLogin
      ? { email, password }
      : { firstName, lastName, email, password, userType };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        alert("Received invalid JSON from server");
        return;
      }

      if (response.ok) {
        alert(`Success! Welcome ${email}`);

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);

        const role = data.role || "student";
        localStorage.setItem("userRole", role);

        setIsAuthenticated(true);
        setUserRole(role);

        if (role === "admin") {
          navigate("/");
        } else {
          navigate("/");
        }
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          alert("Errors:\n" + data.errors.join("\n"));
        } else {
          alert(`Error: ${data.message || "Unknown error"}`);
        }
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      <button
        onClick={() => googleLogin()}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded px-4 py-2 mb-4 hover:bg-gray-100 transition"
      >
        <img
          src={googleIcon}
          alt="Google"
          className="h-5 w-auto object-contain"
        />
        <span className="text-sm text-gray-700 font-medium">
          Continue with Google
        </span>
      </button>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <InputWithIcon
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              icon={User}
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
            )}

            <InputWithIcon
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              icon={UserCheck}
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
            )}
          </>
        )}

        <InputWithIcon
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}

        <InputWithIcon
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password}</p>
        )}

        {!isLogin && (
          <>
            <InputWithIcon
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={Lock}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
            )}

            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <span>I accept the terms and conditions</span>
            </label>
            {errors.acceptedTerms && (
              <p className="text-red-600 text-sm mt-1">{errors.acceptedTerms}</p>
            )}
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          className="text-blue-600 hover:underline"
          onClick={() => {
            setIsLogin(!isLogin);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setFirstName("");
            setLastName("");
            setAcceptedTerms(false);
            setErrors({});
          }}
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}
