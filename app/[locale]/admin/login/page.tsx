"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Link from "next/link";
type loginForm = {
  email: string;
  password: string;
};
const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState<loginForm>({
    password: "",
    email: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { data, status } = useSession();
  //  console.log("data: ", data);
  //  console.log("status: ", status);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    const vaild = await signIn("credentials", {
      password: form.password,
      email: form.email,
      redirect: false,
    });
  
    console.log("test");
    console.log("vaild: ", vaild?.ok);

    if (vaild?.ok === true) {
      router.push("/");
    } else {
      setError("Password or Email is Incorrect");
      setLoading(false);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
    <main>
      <form
        className="max-w-sm mx-auto shadow-lg shadow-slate-500/50 p-7 rounded-lg bg-white h-1/2 sm:w-11/12 md:w-1/2 lg:w-1/2 mt-14  "
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl flex justify-center border-b-2 border-[#00ADEE] mb-4 pb-2">
          Login
        </h1>

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

        {error !== "" && (
          <div className="text-red-500 mt-1 p-2.5 bg-red-50 mb-2 rounded-lg flex justify-center">
            {error}
          </div>
        )}
        <button
          disabled={loading}
          type="submit"
          className="text-white bg-[#00ADEE] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center cursor-pointer  "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <Link
          href="/forgot-password"
          className="block pt-4 text-center text-sm text-primary underline-offset-4 hover:underline m-2"
        >
          Forgot your password?
        </Link>
      </form>

      {/*<h1 className="text-7xl text-white min-h-screen bg-[#00ADEE] flex justify-center items-center w-1/2  ">Think Impact</h1>*/}
    </main>
  );
};

export default Login;
