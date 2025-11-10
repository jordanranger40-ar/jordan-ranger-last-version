import React from 'react';
import { getRoomsByRoomType } from "@/app/models/db/lib/services/rooms";
import FlippingCard from '@/components/flippingcard/flippingcard';
import Link from 'next/link';

interface PageProps {
  params: { locale: string };
}

export default async function Page({ params }: PageProps) {
  const isArabic = params.locale === "ar";
  const rooms = await getRoomsByRoomType("tents");

  return (
    <div className={`mt-14 ${isArabic ? "rtl" : "ltr"}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">
          {isArabic ? "اكتشف خيامنا المميزة" : "Discover Our Premium Tents"}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Link 
            key={room.id} 
            href={`/Accommodation/Tents/${room.slug}`}
          >
            <FlippingCard data={room} isArabic={isArabic} />
          </Link>
        ))}
      </div>
    </div>
  );
}
