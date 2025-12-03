import React from "react";
import { getServerSession } from "next-auth";
import Logo from "@/components/Logo/Logo";
import { authOptions } from "@/app/models/db/authOptions";

import Menu from "./menu";
import LanguageSwitcher from "./languageSwitcher";
import Navbar from "./navbar";
import CartButton from "./cartButton";
import { getCartByUserId } from "@/app/models/db/lib/services/cart";

export default async function Header() {
  const session = await getServerSession(authOptions);
  let isCart = false;
  if (session?.user.id) {
    const cartDetails = await getCartByUserId(session?.user.id);
    isCart = cartDetails.data.length !== 0;
  }

  return (
    <header className="w-full h-14 flex items-center justify-between px-4 border-b">
      <Logo width={20} height={10}/>
      

      <div className="hidden md:block">
        <Navbar />
      </div>     
      <Menu  />

<div className="hidden md:flex items-center gap-3">
        <LanguageSwitcher />
          <CartButton session={session} isCart={isCart} />
      </div>
     

    </header>
  );
}
