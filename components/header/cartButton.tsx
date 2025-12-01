"use client";

import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Session } from "next-auth";

export default function CartButton({
  session,
  isCart,
}: {
  session: Session | null;
  isCart: boolean;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (!session?.user) {
      toast.error("Please Log In First");
      router.push("/login");
      return;
    }

    if (!isCart) {
      toast.error("Your Cart Is Empty");
      return;
    }

    router.push("/my-cart");
  };

  return (
    <button
      onClick={handleClick}
      className="flex text-white hover:text-[#676e32]"
      aria-label="Go to cart"
    >
      <FaShoppingCart />
    </button>
  );
}
