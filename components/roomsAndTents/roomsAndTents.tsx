import React from "react";
import { getRoomsByRoomType } from "@/app/models/db/lib/services/rooms";
import Link from "next/link";
import FlippingCard from "../flippingcard/flippingcard";

export default async function RoomsAndTents() {
  const room = await getRoomsByRoomType("cabins");
  return (
    <section className="w-full my-20 bg-[#f1f1f1] py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#515151] mb-4">
            اكتشف كبائننا المميزة
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            استمتع بتجربة إقامة فريدة وسط الطبيعة، مع كل ما تحتاجه من راحة
            وخصوصية.
          </p>
        </div>

        <div className="flex justify-center">
          <Link href={`/Accommodation/Cabins/${room.slug ?? ""}`}>
            <div className="group cursor-pointer rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300  bg-white relative">
       
                <FlippingCard data={room} />
            

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link href="/Accommodation/Cabins">
            <button className="bg-[#676e32] hover:bg-[#565a3c] text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-300">
              عرض جميع الكبائن
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
