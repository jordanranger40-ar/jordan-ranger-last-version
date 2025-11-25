import React from "react";
import { TrainingBookingWithDetails } from "@/types/index";
import Image from "next/image";

interface Props {
  data: TrainingBookingWithDetails;
}

function TrainingDetailsCard(data: Props) {
  const booking = data.data;

  return (
    <div className="border rounded-2xl shadow-sm p-6 bg-white">
      <h2 className="text-lg font-semibold mb-4 text-[#676e32]">
        Training Details
      </h2>

      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="flex-1 space-y-2 text-sm">
          <div>
            <span className="text-gray-600 font-medium">Training Name:</span>{" "}
            {booking.name_en ?? "—"}
          </div>
          <div>
            <span className="text-gray-600 font-medium">Description:</span>{" "}
            {booking.description_en ?? "No description"}
          </div>
          <div>
            <span className="text-gray-600 font-medium">Training Type:</span>{" "}
            {booking.category_en ?? "—"}
          </div>
          <div>
            <span className="text-gray-600 font-medium">Price:</span>{" "}
            {booking.training_price} JOD
          </div>
          <div>
            <span className="text-gray-600 font-medium">Slug:</span>{" "}
            {booking.slug ?? "—"}
          </div>
        </div>

      </div>
      {/* Images */}
      <div className="flex flex-col md:flex-row gap-4 flex-wrap mt-6">
        {/* Card Image */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium mb-1">Card Image</span>
          <div className="relative w-56 h-40 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
            <Image
              src={booking.card_image ?? "/placeholder-training.jpg"}
              alt={booking.name_en ?? "Card image"}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Header Image */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium mb-1">Header Image</span>
          <div className="relative w-56 h-40 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
            <Image
              src={booking.header_image ?? "/placeholder-training.jpg"}
              alt={booking.name_en ?? "Header image"}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Poster Image */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium mb-1">Poster Image</span>
          <div className="relative w-56 h-40 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
            <Image
              src={booking.post_image ?? "/placeholder-training.jpg"}
              alt={booking.name_en ?? "Poster image"}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainingDetailsCard;
