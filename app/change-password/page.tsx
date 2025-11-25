"use client";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
type changePassword = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};
function Page() {
  const router = useRouter();
  const [form, setForm] = useState<changePassword>({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password === form.confirmPassword) {
      setLoading(true);
      setError("");
      axios
        .put(
          "http://localhost:3000/api/auth/change-password/ad78c00a-5083-45d0-9691-b26b7c90f849",
          {
            oldPassword: form.oldPassword,
            newPassword: form.password,
          }
        )
        .then((result) => {
          console.log(result);
          
          setMessage("Password Changed Successfully");
          setTimeout(() => {
            setMessage("");
            router.push("/");
          }, 2000);
        })
        .catch((error) => {
          setError(error.response.data.message);
          setLoading(false);
        });
    } else {
      setError("*Passwords Don't Match");
      setLoading(false);
    }
  };
  return (
    <main>
      <form
        className="max-w-lg mx-auto shadow-lg shadow-slate-500/50 p-7 rounded-lg bg-white h-1/2 sm:w-11/12 md:w-1/2 lg:w-full mt-14  "
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl flex justify-center border-b-2 border-[#00ADEE] mb-4 pb-2">
          Change Your Password
        </h1>

        <div className="relative  mb-2">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Current Password
          </label>
          <input
            type={!showPassword ? "password" : "text"}
            id="password"
            name="oldPassword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            required
            value={form.oldPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-8/12 right-3 -translate-y-1/2 text-gray-500"
          >
            {!showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="relative  mb-2">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Password
          </label>
          <input
            type={!showPassword ? "password" : "text"}
            id="password"
            name="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            required
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-8/12 right-3 -translate-y-1/2 text-gray-500"
          >
            {!showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className=" relative mb-2">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Confirm password
          </label>
          <input
            type={!showPassword ? "password" : "text"}
            id="password"
            name="confirmPassword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            required
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-8/12 right-3 -translate-y-1/2 text-gray-500"
          >
            {!showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {error !== "" && (
          <div className="text-red-500 mt-1 p-2.5 bg-red-50 mb-2 rounded-lg flex justify-center">
            {error}
          </div>
        )}
        {message !== "" && (
          <div className="text-green-500 mt-1 p-2.5 bg-green-50 mb-2 rounded-lg flex justify-center">
            {message}
          </div>
        )}
        <button
          disabled={loading}
          type="submit"
          className="text-white bg-[#00ADEE] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center cursor-pointer  "
        >
          {loading ? "Changing..." : "Change"}
        </button>

        <Link
          href="/"
          className="block pt-4 text-center text-sm text-primary underline-offset-4 hover:underline m-2"
        >
          Back To Home
        </Link>
      </form>
    </main>
  );
}

export default Page;
