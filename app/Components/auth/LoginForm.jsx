"use client";
import { performLogin } from "@/app/actions";
import { useState } from "react";

function LoginForm() {
  const [error, setError] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      await performLogin(formData);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="p-6 bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-w-md mx-auto">
      {/* Error Message */}
      {error && (
        <div className="mb-4 text-center text-red-600 font-medium bg-red-100/70 p-2 rounded">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        {/* Username */}
        <div className="flex flex-col">
          <label htmlFor="username" className="mb-2 font-semibold text-gray-800">
            User Name
          </label>
          <input
            type="text"
            name="username"
            id="username"
            required
            placeholder="Enter your username"
            className="px-4 py-3 rounded-xl border border-gray-300 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition shadow-sm"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2 font-semibold text-gray-800">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            placeholder="••••••••"
            className="px-4 py-3 rounded-xl border border-gray-300 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition shadow-sm"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 font-bold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 shadow-lg transition-transform transform hover:scale-105"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
