"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";

interface BannerData {
  alt: string;
  description_en: string;
  description_ar: string;
  image?: string | null;
}

export async function createBanner(data: BannerData) {
  const session = await getServerSession(authOptions);
  const token = session?.user.token;
 
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/banners`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    }
  );
console.log("result.ok: ",result.ok);

if (!result.ok) throw new Error("Failed to create banner");

  revalidatePath(`/dashboard/banners`);
  return await result.json();
}
