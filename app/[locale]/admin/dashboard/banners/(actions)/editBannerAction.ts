"use server"
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/models/db/authOptions";
interface BannerUpdate {
  bannerId?: string;
  alt: string;
  description_en: string;
  description_ar: string;
  image?: string | null;
}

export async function editBanner(data: BannerUpdate) {
  const { bannerId, ...body } = data;
const session = await getServerSession(authOptions);
  const token = session?.user.token;
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/banners/${bannerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to update banner");

  revalidatePath(`/dashboard/banners`);

  return res.json();
}
