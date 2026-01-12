import {
  getCartByUserId,
  getCartItemsByUserId,
} from "@/app/models/db/lib/services/cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/models/db/authOptions";
import CheckoutWrapper from "@/components/checkout/CheckoutWrapper";
import { redirect } from "next/navigation";
interface Props {
  params: Promise<{ locale: "en" | "ar" }>;
}
async function Page({ params }: Props) {
  const session = await getServerSession(authOptions);
  const locale = (await params).locale;
  
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <p className="text-gray-600 text-lg">
          Please log in to procced to checkout
        </p>
      </div>
    );
  }
  const cartData = (await getCartByUserId(session.user.id)).data[0];
    const cartDetails = (await getCartItemsByUserId(session.user.id)).data;
    
   if (cartDetails?.length === 0 || cartDetails===null) {
    redirect("/")
  }
    const safeCartData = JSON.parse(JSON.stringify(cartData || []));
    const safeCartDetails = JSON.parse(JSON.stringify(cartDetails || []));
  return (
    <div >
      <CheckoutWrapper locale={locale} safeCartData={safeCartData} safeCartDetails={safeCartDetails}  />
    </div>
  );
}

export default Page;
