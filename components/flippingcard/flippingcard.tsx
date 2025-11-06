"use client";

import React from "react";
import Image from "next/image";
import type {newRoom} from "@/types/index";
import Link from "next/link";

interface CardProps {
  data:newRoom ;

}

const FlippingCard: React.FC<CardProps> = ({ data }) => {
  return (
    <div className="relative mx-auto w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-4 ring-4 ring-zinc-300/25 sm:p-6">
      <div className="flex flex-col gap-4">
        {/* Property Image */}
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={data.room_images[0]}
            alt="Modern apartment with city view"
            width={500}
            height={375}
            className="aspect-[4/3] w-full bg-zinc-600 object-cover"
          />

     

          {/* Property Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center rounded-full bg-[#676e32] px-3 py-1 text-xs font-medium text-white">
              Superhost
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-zinc-900">{data.name_en}</h3>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="inline-block size-4 text-[#676e32]"
              >
                <path
                  fillRule="evenodd"
                  d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-semibold text-zinc-700">4.9</span>
            </div>
          </div>

      
          <p className="text-sm font-medium text-zinc-600">{data.description_en}</p>

          <div className="mt-5 flex items-center justify-between gap-4">
   
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-semibold text-zinc-900">{data.price } jd</span>
              <span className="text-sm text-zinc-600">/night</span>
            </div>

            <p className="text-sm text-zinc-600">Dec 15 – 20</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippingCard;
