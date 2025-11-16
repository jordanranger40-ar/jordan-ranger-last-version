"use client";

import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CartButton({ session }: { session: any }) {
  const router = useRouter();
  

  const handleClick = () => {
    if (!session?.user) {
      toast.error("Please Log In First", {});
       router.push("/login")
      return;
    }

 
    router.push("/my-cart");
  };

  return (
    <button
      onClick={handleClick}
      className="hidden md:flex text-white hover:text-[#676e32]"
      aria-label="Go to cart"
    >
      <FaShoppingCart />
    </button>
  );
}
