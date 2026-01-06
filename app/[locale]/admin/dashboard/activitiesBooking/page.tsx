import { getActivityByType } from "@/app/models/db/lib/services/activities";
import Link from "next/link";
import Image from "next/image";

export default async function ActivitiesBooking() {
  const indoorActivities = await getActivityByType("indoor");
  const outdoorActivities = await getActivityByType("outdoor");

  return (
    <main className=" ml:0 md:ml-2.5 lg:ml-5 mt-2">
      <header className="mb-4">
        <h1 className=" ml-2 text-xl lg:text-3xl font-semibold">
          All Activities by Location Type
        </h1>
        <p className="text-gray-600 mt-1 ml-2">
          Browse activites grouped by location type
        </p>
      </header>

      {indoorActivities && (
        <div className="space-y-12 mt-8">
          <h2 className="text-2xl w-[95vw] ml-1 lg:ml-0 md:w-[70vw] lg:w-[80vw] font-semibold border-b pb-2 text-center flex flex-row justify-center">
            Inddoor Activities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {indoorActivities.map((activity, j) => (
              <Link
                key={j}
                href={`/admin/dashboard/activitiesBooking/${activity.id}`}
                className="group flex flex-col items-center gap-2 text-center hover:scale-105 transition-transform duration-500 ease-in-out"
              >
                <div className="w-44 h-44 rounded-full overflow-hidden flex items-center justify-center border shadow-md bg-gray-50 hover:shadow-lg">
                  <Image
                    src={activity.card_image ?? ""}
                    alt={activity.name_en}
                    width={50}
                    height={50}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-sm font-medium truncate max-w-36 mt-2">
                  {activity.name_en}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {outdoorActivities && (
        <div className="space-y-12 mt-16 mb-16">
          <h2 className="text-2xl w-[95vw] ml-1 lg:ml-0 md:w-[70vw] lg:w-[80vw] font-semibold border-b pb-2 text-center flex flex-row justify-center">
            Outdoor Activities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {outdoorActivities.map((activity, j) => (
              <Link
                key={j}
                href={`/admin/dashboard/activitiesBooking/${activity.id}`}
                className="group flex flex-col items-center gap-2 text-center hover:scale-105 transition-transform duration-500 ease-in-out"
              >
                <div className="w-44 h-44 rounded-full overflow-hidden flex items-center justify-center border shadow-md bg-gray-50 hover:shadow-lg">
                  <Image
                    src={activity.card_image ?? "DefaultImage"}
                    alt={activity.name_en}
                    width={50}
                    height={50}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-sm font-medium truncate max-w-36 mt-2">
                  {activity.name_en}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
