import React from "react";
import { getRoomsByRoomType } from "@/app/models/db/lib/services/rooms";
import FlippingCard from "@/components/flippingcard/flippingcard";
import Link from "next/link";

export default async function Page() {
  const data = await getRoomsByRoomType("cabins"); // ← يرجع مصفوفة من الغرف

  return (
    <div className="my-14">
      <h2 className="text-center text-2xl font-bold mb-8 text-[#515151]">
        اكتشف الكبائن
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {data.map((room) => (
          <Link
            key={room.id}
            href={`/Accommodation/Cabins/${room.slug}`}
            className="block"
          >
            <FlippingCard data={room} />
          </Link>
        ))}
      </div>
    </div>
  );
}
