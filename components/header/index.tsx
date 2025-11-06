import React from "react";
import { FaShoppingCart } from 'react-icons/fa';
import Link from "next/link";

import Menu from "./menu";
import LanguageSwitcher from "./languageSwitcher";
import Navbar from "./navbar";

import { getAllcategories } from "@/app/models/db/lib/services/Accommodation";
import { getAllTraining } from "@/app/models/db/lib/services/training";

export default async function Header() {
  const categories = await getAllcategories();
  const trainingData = await getAllTraining();

  return (
    <header className="  w-full h-14 flex items-center justify-between px-4 border-b ">
      <div className="hidden md:flex">
        <LanguageSwitcher />
      </div>

      <div className="hidden md:block">
        <Navbar categories={categories} trainingData={trainingData.data} />
      </div>
             <Link href="/my-cart">
      <div className="hidden md:flex">
      <FaShoppingCart className="text-white hover:text-[#676e32] " />
      </div>
      </Link>
      <Menu categories={categories} trainingData={trainingData.data} />
    </header>
  );
}
