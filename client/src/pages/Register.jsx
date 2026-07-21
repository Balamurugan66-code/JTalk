import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
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
      const res = await api.post("/auth/register", form);

      localStorage.setItem("token", res.data.token);

      setUser(res.data.user);

      alert("Registration Successful");

      window.location.href = "/home";
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Left Side */}

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700 text-white flex-col justify-center px-20 relative overflow-hidden">

        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-cyan-300/10 blur-3xl"></div>

        <div className="relative z-10">

          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-blue-700 text-4xl font-bold shadow-xl">
            J
          </div>

          <h1 className="text-5xl font-bold mt-8">
            Join JTalk
          </h1>

          <p className="text-xl text-blue-100 mt-5 leading-relaxed max-w-md">
            Create your account and experience
            secure real-time messaging, team
            collaboration, intelligent file sharing,
            and seamless group conversations.
          </p>

          <div className="mt-14 space-y-5">

            <div className="flex items-center gap-4">
              <div className="text-3xl">🔒</div>
              <div>
                <h3 className="font-semibold text-lg">
                  Secure Authentication
                </h3>
                <p className="text-blue-100">
                  Your conversations stay protected.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl">⚡</div>
              <div>
                <h3 className="font-semibold text-lg">
                  Lightning Fast
                </h3>
                <p className="text-blue-100">
                  Instant communication powered by
                  Socket.IO.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl">🌐</div>
              <div>
                <h3 className="font-semibold text-lg">
                  Work Together
                </h3>
                <p className="text-blue-100">
                  Connect with individuals and teams
                  effortlessly.
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
              Create Account
            </h2>

            <p className="mt-2 text-gray-500">
              Register to start using JTalk
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

            </div>

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
                placeholder="Create a password"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-xl shadow-md"
            >
              Create Account
            </button>

          </form>

          <p className="text-center text-gray-600 mt-8">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign In
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}