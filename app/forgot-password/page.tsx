"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
function page() {
  const [form, setform] = useState<{ email: string }>({
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [success, setsuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault();
     setsuccess(true)
    axios
      .post("http://localhost:3000/api/auth/forgot-password", {
        email: form.email,
      })
      .then((result) => {
        setLoading(false)
        console.log(result);
       
      })
      .catch((error) => {
        console.log("error");
        
      });
  };
  return (
    <main className="flex flex-row gap-5 justify-center items-center mt-16">
  <form
    className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg shadow-gray-300/50 space-y-6"
    onSubmit={onSubmit}
  >
    {/* Header */}
    {!success && (
      <h1 className="text-2xl font-bold text-center text-gray-800 border-b-2 border-[#00ADEE] pb-3 mb-6">
        Enter Your Email
      </h1>
    )}

    {success && (
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-gray-700">Check Your Email</h2>
        <p className="text-sm text-gray-500">
          If an account exists with that email, a password reset link has been sent.
        </p>
      </div>
    )}

    {/* Email input */}
    {!success && (
      <div className="flex flex-col space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-gray-700"
        >
       
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00ADEE] focus:border-[#00ADEE] transition"
          placeholder="you@example.com"
        />
      </div>
    )}

    {/* Message */}
    {message !== "" && (
      <div className="text-red-600 text-center p-2.5 bg-red-50 rounded-lg">
        {message}
      </div>
    )}

    {/* Submit button */}
    {!success && (
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#00ADEE] text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#00ADEE] transition"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    )}

    {/* Back to login */}
    <div className="text-center pt-4">
      <Link
        href="/admin/login"
        className="text-sm text-[#00ADEE] hover:underline font-medium"
      >
        Back To Login
      </Link>
    </div>
  </form>
</main>

  );
}

export default page;
