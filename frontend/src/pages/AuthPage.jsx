
// import { useState } from "react";
// import { User, UserCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// function InputWithIcon({
//   icon: Icon,
//   type,
//   value,
//   onChange,
//   placeholder,
//   showToggle,
//   toggleType,
// }) {
//   return (
//     <div className="relative">
//       <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
//       <input
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full pl-10 pr-10 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//       />
//       {showToggle && (
//         <span
//           onClick={toggleType}
//           className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-blue-400 hover:text-blue-500 transition"
//         >
//           {type === "password" ? <Eye size={20} /> : <EyeOff size={20} />}
//         </span>
//       )}
//     </div>
//   );
// }

// export default function AuthPage({ setIsAuthenticated, setUserRole }) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [acceptedTerms, setAcceptedTerms] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const navigate = useNavigate();

//   const BASE_URL = "http://localhost:3001";

//   function validatePassword(pw) {
//     const uppercase = /[A-Z]/;
//     const number = /[0-9]/;
//     const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
//     return uppercase.test(pw) && number.test(pw) && specialChar.test(pw);
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();

//     const newErrors = {};

//     if (!email) newErrors.email = "Email is required";
//     else if (!email.endsWith("@gmail.com"))
//       newErrors.email = "Only Gmail addresses allowed.";

//     if (!password) newErrors.password = "Password is required";

//     if (!isLogin) {
//       if (!firstName.trim()) newErrors.firstName = "First name is required";
//       if (!lastName.trim()) newErrors.lastName = "Last name is required";

//       if (!validatePassword(password))
//         newErrors.password =
//           "Password must include uppercase, number & special character.";

//       if (password !== confirmPassword)
//         newErrors.confirmPassword = "Passwords do not match";

//       if (!acceptedTerms)
//         newErrors.acceptedTerms = "Please accept the terms and conditions";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     const endpoint = isLogin
//       ? `${BASE_URL}/api/login`
//       : `${BASE_URL}/api/signup`;
//     const payload = isLogin
//       ? { email, password }
//       : { firstName, lastName, email, password, userType: "student" };

//     try {
//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });

//       const text = await res.text();
//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch {
//         alert("Invalid server response");
//         return;
//       }

//       if (res.ok) {
//         localStorage.setItem("isLoggedIn", "true");
//         localStorage.setItem("userEmail", email);
//         const role = data.user?.role || "student";
//         localStorage.setItem("userRole", role);
//         setIsAuthenticated(true);
//         setUserRole(role);
//         navigate("/");
//       } else {
//         alert(data.message || "Login/signup failed");
//       }
//     } catch (err) {
//       alert("Network error: " + err.message);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-10 space-y-6">
//         <h2 className="text-3xl font-extrabold text-center text-blue-600">
//           {isLogin ? "Welcome Back 👋" : "Join Us Today "}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {!isLogin && (
//             <>
//               <InputWithIcon
//                 type="text"
//                 placeholder="First Name"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 icon={User}
//               />
//               {errors.firstName && (
//                 <p className="text-sm text-red-600">{errors.firstName}</p>
//               )}

//               <InputWithIcon
//                 type="text"
//                 placeholder="Last Name"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 icon={UserCheck}
//               />
//               {errors.lastName && (
//                 <p className="text-sm text-red-600">{errors.lastName}</p>
//               )}
//             </>
//           )}

//           <InputWithIcon
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             icon={Mail}
//           />
//           {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

//           <InputWithIcon
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             icon={Lock}
//             showToggle={true}
//             toggleType={() => setShowPassword(!showPassword)}
//           />
//           {errors.password && (
//             <p className="text-sm text-red-600">{errors.password}</p>
//           )}

//           {!isLogin && (
//             <>
//               <InputWithIcon
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 icon={Lock}
//                 showToggle={true}
//                 toggleType={() => setShowConfirmPassword(!showConfirmPassword)}
//               />
//               {errors.confirmPassword && (
//                 <p className="text-sm text-red-600">{errors.confirmPassword}</p>
//               )}

//               <label className="flex items-center text-sm mt-1">
//                 <input
//                   type="checkbox"
//                   checked={acceptedTerms}
//                   onChange={(e) => setAcceptedTerms(e.target.checked)}
//                   className="mr-2 accent-blue-400"
//                 />
//                 <span className="text-blue-600 font-medium">
//                   I accept the terms and conditions
//                 </span>
//               </label>
//               {errors.acceptedTerms && (
//                 <p className="text-sm text-red-600">{errors.acceptedTerms}</p>
//               )}
//             </>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2.5 rounded-xl hover:from-blue-500 hover:to-blue-700 transition font-semibold shadow-md"
//           >
//             {isLogin ? "Login" : "Create Account"}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-sm text-blue-600">
//           {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
//           <button
//             onClick={() => {
//               setIsLogin(!isLogin);
//               setEmail("");
//               setPassword("");
//               setConfirmPassword("");
//               setFirstName("");
//               setLastName("");
//               setAcceptedTerms(false);
//               setErrors({});
//               setShowPassword(false);
//               setShowConfirmPassword(false);
//             }}
//             className="text-blue-500 hover:underline font-semibold"
//           >
//             {isLogin ? "Sign Up" : "Login"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { User, UserCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

function InputWithIcon({
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  showToggle,
  toggleType,
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      {showToggle && (
        <span
          onClick={toggleType}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-blue-400 hover:text-blue-500 transition"
        >
          {type === "password" ? <Eye size={20} /> : <EyeOff size={20} />}
        </span>
      )}
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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(""); // <-- General error here
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:3001";

  function validatePassword(pw) {
    const uppercase = /[A-Z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    return uppercase.test(pw) && number.test(pw) && specialChar.test(pw);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError(""); // clear general error on new submit

    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!email.endsWith("@gmail.com"))
      newErrors.email = "Only Gmail addresses allowed.";

    if (!password) newErrors.password = "Password is required";

    if (!isLogin) {
      if (!firstName.trim()) newErrors.firstName = "First name is required";
      if (!lastName.trim()) newErrors.lastName = "Last name is required";

      if (!validatePassword(password))
        newErrors.password =
          "Password must include uppercase, number & special character.";

      if (password !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";

      if (!acceptedTerms)
        newErrors.acceptedTerms = "Please accept the terms and conditions";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const endpoint = isLogin
      ? `${BASE_URL}/api/login`
      : `${BASE_URL}/api/signup`;
    const payload = isLogin
      ? { email, password }
      : { firstName, lastName, email, password, userType: "student" };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        setGeneralError("Invalid server response");
        return;
      }

      if (res.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        const role = data.user?.role || "student";
        localStorage.setItem("userRole", role);
        setIsAuthenticated(true);
        setUserRole(role);
        navigate("/");
      } else {
        setGeneralError(data.message || "Login/signup failed");
      }
    } catch (err) {
      setGeneralError("Network error: " + err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-10 space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-blue-600">
          {isLogin ? "Welcome Back" : "Join Us Today "}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Show general error here */}
          {generalError && (
            <p className="text-center text-red-600 font-semibold">{generalError}</p>
          )}

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
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}

              <InputWithIcon
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                icon={UserCheck}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
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
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

          <InputWithIcon
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            showToggle={true}
            toggleType={() => setShowPassword(!showPassword)}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password}</p>
          )}

          {!isLogin && (
            <>
              <InputWithIcon
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={Lock}
                showToggle={true}
                toggleType={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}

              <label className="flex items-center text-sm mt-1">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mr-2 accent-blue-400"
                />
                <span className="text-blue-600 font-medium">
                  I accept the terms and conditions
                </span>
              </label>
              {errors.acceptedTerms && (
                <p className="text-sm text-red-600">{errors.acceptedTerms}</p>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2.5 rounded-xl hover:from-blue-500 hover:to-blue-700 transition font-semibold shadow-md"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-blue-600">
          {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              setFirstName("");
              setLastName("");
              setAcceptedTerms(false);
              setErrors({});
              setGeneralError(""); // Clear general error on toggle
              setShowPassword(false);
              setShowConfirmPassword(false);
            }}
            className="text-blue-500 hover:underline font-semibold"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
