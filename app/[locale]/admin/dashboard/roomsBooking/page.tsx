import Link from "next/link";
import Image from "next/image";
import { getRoomsByRoomType } from "@/app/models/db/lib/services/rooms";

export default async function RoomsBooking() {
  const cabins = await getRoomsByRoomType("cabins");
  const tents = await getRoomsByRoomType("tents");

  return (
    <main className=" ml:0 md:ml-2.5 lg:ml-5 mt-2">
      <header className="mb-4">
        <h1 className=" ml-2 text-xl lg:text-3xl font-semibold">
          All Rooms by Type
        </h1>
        <p className="text-gray-600 mt-1 ml-2">
          Browse rooms grouped by type
        </p>
      </header>

      {cabins && (
        <div className="space-y-12 mt-8">
          <h2 className="text-2xl w-[95vw] ml-1 lg:ml-0 md:w-[70vw] lg:w-[80vw] font-semibold border-b pb-2 text-center flex flex-row justify-center">
            Cabins
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {cabins.map((cabin, j) => (
              <Link
                key={j}
                href={`/admin/dashboard/roomsBooking/${cabin.id}`}
                className="group flex flex-col items-center gap-2 text-center hover:scale-105 transition-transform duration-500 ease-in-out"
              >
                <div className="w-44 h-44 rounded-full overflow-hidden flex items-center justify-center border shadow-md bg-gray-50 hover:shadow-lg">
                  <Image
                    src={cabin.cover_image ?? ""}
                    alt={cabin.name_en}
                    width={50}
                    height={50}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-sm font-medium truncate max-w-36 mt-2">
                  {cabin.name_en}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {tents && (
        <div className="space-y-12 mt-16 mb-16">
          <h2 className="text-2xl w-[95vw] ml-1 lg:ml-0 md:w-[70vw] lg:w-[80vw] font-semibold border-b pb-2 text-center flex flex-row justify-center">
            Tents
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {tents.map((tent, j) => (
              <Link
                key={j}
                href={`/admin/dashboard/roomsBooking/${tent.id}`}
                className="group flex flex-col items-center gap-2 text-center hover:scale-105 transition-transform duration-500 ease-in-out"
              >
                <div className="w-44 h-44 rounded-full overflow-hidden flex items-center justify-center border shadow-md bg-gray-50 hover:shadow-lg">
                  <Image
                    src={tent.cover_image ?? "DefaultImage"}
                    alt={tent.name_en}
                    width={50}
                    height={50}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-sm font-medium truncate max-w-36 mt-2">
                  {tent.name_en}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
