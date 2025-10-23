"use client";
import React from "react";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useRouter } from "next/navigation";

type registerform = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};
function Page() {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [registered, setRegistered] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [form, setForm] = useState<registerform>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === confirmPassword) {
      console.log("password: ", password);

      form.password = password;
      console.log("form: ", form);
      setError("");

      setLoading(true);
      axios
        .post<registerform>("http://localhost:3000/api/users/register", form)
        .then((result) => {
          console.log(result);

          router.push("/");
        })
        .catch((error) => {
          console.log("error: ", error.response.data.message);
          setError(error.response.data.message);
          setLoading(false);
        });
    } else {
      console.log(confirmPassword);
      setRegistered("");
      setError("*Passwords don't match");
      console.log("error: ", error);
      return;
    }
  };
  return (
    <main className=" flex flex-row gap-5 justify-center items-center  ">
      <form
        className="max-w-sm mx-auto shadow-lg shadow-slate-500/50 p-7 rounded-lg bg-white h-1/2 sm:w-11/12 md:w-1/2 lg:w-1/2  mt-5"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl flex justify-center border-b-2 border-[#00ADEE] mb-4 pb-2">
          Register
        </h1>
        <div className="mb-5">
          <label
            htmlFor="first_name"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            required
            value={form.first_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="last_name"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            required
            value={form.last_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            required
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="relative  mb-5">
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
            onChange={(e) => {
              setPassword(e.target.value);
            }}
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
        <div className=" relative mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Confirm password
          </label>
          <input
            type={!showPassword ? "password" : "text"}
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            required
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
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
          <div className="text-red-500 mt-1 p-2.5 bg-red-50 mb-2 rounded-lg">
            {error}
          </div>
        )}
        <button
          disabled={loading}
          type="submit"
          className="text-white bg-[#00ADEE] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center cursor-pointer  "
        >
          {loading ? "Registering..." : "Create"}
        </button>
      </form>
      {/*<h1 className="text-7xl text-white min-h-screen bg-[#00ADEE] flex justify-center items-center w-1/2  ">Think Impact</h1>*/}
    </main>
  );
}

export default Page;
