import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  // Real-time validation
  useEffect(() => {
    const newError = { ...error };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (touched.email) {
      if (!form.email.trim()) newError.email = "Email cannot be empty";
      else if (!emailRegex.test(form.email)) newError.email = "Invalid email format";
      else newError.email = "";
    }

    // Password validation
    if (touched.password) {
      if (!form.password) newError.password = "Password cannot be empty";
      else if (form.password.length < 6) newError.password = "Password must be at least 6 characters";
      else if (/\s/.test(form.password)) newError.password = "Password cannot contain spaces";
      else newError.password = "";
    }

    setError(newError);
  }, [form, touched]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!error.email && !error.password) {
      setLoading(true);
      try {
        const res = await api.post("/login", form);
        localStorage.setItem("token", res.data.token);
        navigate("/", { replace: true });
      } catch (err) {
        setError({ ...error, password: err.response?.data?.message || "Login failed" });
      }
      setLoading(false);
    }
  };

  const isDisabled = !form.email || !form.password || error.email || error.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 w-96 rounded-3xl relative shadow-xl overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>

        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
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
            {loading ? "Loading..." : "Login"}
          </button>

          <p className="text-center text-gray-400 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-indigo-400 hover:underline">
              Signup
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
