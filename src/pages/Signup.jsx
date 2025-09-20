import React, { useState, useEffect } from "react";
import api from "../services/api"
import {replace, useNavigate} from 'react-router-dom'
function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [cPassword, setCPassword] = useState("");
  const [error, setError] = useState({ name: "", email: "", password: "" });
  const [touched, setTouched] = useState({ name: false, email: false, password: false, cPassword: false });
  const [loading,setLoading]=useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  // Real-time validation, only show error if field is touched
  useEffect(() => {
    const newError = { ...error };

    // Name validation
    const nameRegex = /^[A-Za-z]+$/;
    if (touched.name) {
      if (!form.name.trim()) newError.name = "Name cannot be empty";
      else if (!nameRegex.test(form.name)) newError.name = "Name must contain letters only";
      else newError.name = "";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (touched.email) {
      if (!form.email.trim()) newError.email = "Email cannot be empty";
      else if (!emailRegex.test(form.email)) newError.email = "Invalid email format";
      else newError.email = "";
    }

    // Password validation
    if (touched.password || touched.cPassword) {
      if (!form.password) newError.password = "Password cannot be empty";
      else if (form.password.length < 6) newError.password = "Password must be at least 6 characters";
      else if (/\s/.test(form.password)) newError.password = "Password cannot contain spaces";
      else if (cPassword && form.password !== cPassword) newError.password = "Passwords do not match";
      else newError.password = "";
    }

    setError(newError);
  }, [form, cPassword, touched]);

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (!error.name && !error.email && !error.password) {
      setLoading(true)
      const res = await api.post("/register",form)
      localStorage.setItem('token',res.data.token)
      navigate('/',replace)
      setLoading(false)
    }
  };

  const isDisabled =
    !form.name || !form.email || !form.password || !cPassword || error.name || error.email || error.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 w-96 rounded-3xl relative shadow-xl overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>

        <h2 className="text-3xl font-bold text-white text-center mb-6">Todo App</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
            className="bg-gray-700 font-extralight text-xl text-white placeholder-gray-400 w-full py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          {error.name && <p className="text-red-500 text-sm">{error.name}</p>}

          {/* Email */}
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
            className="bg-gray-700 text-xl text-white placeholder-gray-400 w-full py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          {error.email && <p className="text-red-500 text-sm">{error.email}</p>}

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            onBlur={() => handleBlur("password")}
            className="bg-gray-700 text-xl text-white placeholder-gray-400 w-full py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={cPassword}
            onChange={(e) => setCPassword(e.target.value)}
            onBlur={() => handleBlur("cPassword")}
            className="bg-gray-700 text-xl text-white placeholder-gray-400 w-full py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          {error.password && <p className="text-red-500 text-sm">{error.password}</p>}

          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              isDisabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            { loading? "Loading...":"Submit" }
          </button>

          <p className="text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-400 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
