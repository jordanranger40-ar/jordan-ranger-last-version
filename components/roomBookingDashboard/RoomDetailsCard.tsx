import React from "react";
import { RoomBookingWithDetails } from "@/types/index";

interface Props {
  data:  RoomBookingWithDetails ;
}

function RoomDetailsCard(data: Props) {
  const booking = data.data;

  return (
    <div className="border rounded-2xl shadow-sm p-6 bg-white">
      <h2 className="text-lg font-semibold mb-4 text-[#676e32]">
        Room Details
      </h2>

      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="flex-1 space-y-2 text-sm">
          <div>
            <span className="text-gray-600 font-medium">Room Name:</span>{" "}
            {booking.name_en ?? "—"}
          </div>
          <div>
            <span className="text-gray-600 font-medium">Description:</span>{" "}
            {booking.description_en ?? "No description"}
          </div>
          <div>
            <span className="text-gray-600 font-medium">Room Type:</span>{" "}
            {booking.room_type_en ?? "—"}
          </div>
          <div>
            <span className="text-gray-600 font-medium">Price:</span>{" "}
            {typeof booking.price === "number"
              ? `${booking.price} JOD/Day`
              : "—"}
          </div>
          <div>
            <span className="text-gray-600 font-medium">Slug:</span>{" "}
            {booking.slug ?? "—"}
          </div>
        </div>

        {/* Image */}
        <div className="w-full md:w-56 h-40 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
          <img
            src={
              booking.cover_image ??
              (booking.room_images && booking.room_images[0]) ??
              "/placeholder-room.jpg"
            }
            alt={booking.name_en ?? "Room image"}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Gallery */}
      {booking.room_images && booking.room_images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {booking.room_images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${booking.name_en ?? "Room"} ${idx + 1}`}
              className="w-full h-28 object-cover rounded-lg shadow-sm"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RoomDetailsCard;
