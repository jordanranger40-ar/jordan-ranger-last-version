"use client";

import React from "react";
import Image from "next/image";
import Molto from "@/public/images/molto2.jpg";

interface CardProps {
  title: string;
  description: string;
  image: string;
}

const FlippingCard: React.FC<CardProps> = ({ title, description,image }) => {
  return (
    <div className="relative mx-auto w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-4 ring-4 ring-zinc-300/25 sm:p-6">
      <div className="flex flex-col gap-4">
        {/* Property Image */}
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src={image}
            alt="Modern apartment with city view"
            width={500}
            height={375}
            className="aspect-[4/3] w-full bg-zinc-600 object-cover"
          />

          {/* Favorite Button */}
          <button
            type="button"
            className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:text-rose-600 active:scale-100"
            aria-label="Add to favorites"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="inline-block size-5"
            >
              <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
            </svg>
          </button>

          {/* Property Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white">
              Superhost
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-zinc-900">{title}</h3>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="inline-block size-4 text-teal-500"
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

          {/* Property Type */}
          <p className="text-sm font-medium text-zinc-600">{description}</p>

          <div className="mt-5 flex items-center justify-between gap-4">
            {/* Price */}
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-semibold text-zinc-900">$149</span>
              <span className="text-sm text-zinc-600">/night</span>
            </div>

            {/* Dates */}
            <p className="text-sm text-zinc-600">Dec 15 – 20</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippingCard;
