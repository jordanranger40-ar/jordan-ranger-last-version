import React from "react";
import { getRoomsByRoomType } from "@/app/models/db/lib/services/rooms";
import Link from "next/link";
import FlippingCard from "../flippingcard/flippingcard";

interface Props {
  isArabic: boolean;
}

export default async function RoomsAndTents({ isArabic }: Props) {
  const rooms = await getRoomsByRoomType("cabins");

  return (
    <section className="w-full  ">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
         
          <p className="text-gray-900 max-w-2xl mx-auto text-sm sm:text-lg">
            {isArabic
              ? "استمتع بتجربة إقامة فريدة وسط الطبيعة، مع كل ما تحتاجه من راحة وخصوصية."
              : "Enjoy a unique stay amidst nature, with all the comfort and privacy you need."}
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Link
              key={room.id}
              href={`/Accommodation/Cabins/${room.slug}`}
            >
              <FlippingCard data={room} isArabic={isArabic} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
