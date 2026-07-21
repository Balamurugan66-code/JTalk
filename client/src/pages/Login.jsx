import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      alert("Login Successful");
      window.location.href = "/home";
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white flex-col justify-center px-20 relative overflow-hidden">

        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-cyan-300/10 blur-3xl"></div>

        <div className="relative z-10">

          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-blue-700 text-4xl font-bold shadow-xl">
            J
          </div>

          <h1 className="text-5xl font-bold mt-8">
            JTalk
          </h1>

          <p className="text-xl text-blue-100 mt-5 leading-relaxed max-w-md">
            A modern real-time messaging platform
            built for seamless communication,
            collaboration, secure file sharing and
            group conversations.
          </p>

          <div className="mt-14 space-y-5">

            <div className="flex items-center gap-4">
              <div className="text-3xl">💬</div>
              <div>
                <h3 className="font-semibold text-lg">
                  Instant Messaging
                </h3>
                <p className="text-blue-100">
                  Fast and reliable real-time chat.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl">👥</div>
              <div>
                <h3 className="font-semibold text-lg">
                  Group Collaboration
                </h3>
                <p className="text-blue-100">
                  Organize discussions with teams.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl">📎</div>
              <div>
                <h3 className="font-semibold text-lg">
                  File Sharing
                </h3>
                <p className="text-blue-100">
                  Share documents and media securely.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className="flex-1 flex items-center justify-center p-8">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">

          <div className="text-center">

            <div className="mx-auto w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
              J
            </div>

            <h2 className="mt-6 text-3xl font-bold text-gray-800">
              Welcome Back
            </h2>

            <p className="mt-2 text-gray-500">
              Sign in to continue to JTalk
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-xl shadow-md"
            >
              Sign In
            </button>

          </form>

          <p className="text-center text-gray-600 mt-8">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}