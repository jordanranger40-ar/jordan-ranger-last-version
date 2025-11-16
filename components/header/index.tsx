import React from "react";
import { getServerSession } from "next-auth";
import Link from "next/link";

import { getAllcategories } from "@/app/models/db/lib/services/Accommodation";
import { getAllTraining } from "@/app/models/db/lib/services/training";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import Menu from "./menu";
import LanguageSwitcher from "./languageSwitcher";
import Navbar from "./navbar";
import CartButton from "./cartButton"; 

export default async function Header() {
  const session = await getServerSession(authOptions);
  const categories = await getAllcategories();
  const trainingData = await getAllTraining();

  return (
    <header className="w-full h-14 flex items-center justify-between px-4 border-b">
      <div className="hidden md:flex">
        <LanguageSwitcher />
      </div>

      <div className="hidden md:block">
        <Navbar categories={categories} trainingData={trainingData.data} />
      </div>

      {/* 👇 زر السلة الجديد */}
      <CartButton session={session} />

      <Menu categories={categories} trainingData={trainingData.data} />
    </header>
  );
}
