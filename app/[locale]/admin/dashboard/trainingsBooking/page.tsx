import Link from "next/link";
import Image from "next/image";
import { getTrainingsByType } from "@/app/models/db/lib/services/training_booking";

export default async function TrainingsBooking() {
  const schoolsTrainings = (await getTrainingsByType("Schools Training")).data;
  const corporateTeamBuilding = (await getTrainingsByType("Corporate Team Building")).data;

  return (
    <main className=" ml:0 md:ml-2.5 lg:ml-5 mt-2">
      <header className="mb-4">
        <h1 className=" ml-2 text-xl lg:text-3xl font-semibold">
          All Trainings by Type
        </h1>
        <p className="text-gray-600 mt-1 ml-2">
          Browse trainings grouped by type
        </p>
      </header>

      {schoolsTrainings && (
        <div className="space-y-12 mt-8">
          <h2 className="text-2xl w-[95vw] ml-1 lg:ml-0 md:w-[70vw] lg:w-[80vw] font-semibold border-b pb-2 text-center flex flex-row justify-center">
            Shcool Training
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {schoolsTrainings.map((shcoolTraining, j) => (
              <Link
                key={j}
                href={`/admin/dashboard/trainingsBooking/${shcoolTraining.id}`}
                className="group flex flex-col items-center gap-2 text-center hover:scale-105 transition-transform duration-500 ease-in-out"
              >
                <div className="w-44 h-44 rounded-full overflow-hidden flex items-center justify-center border shadow-md bg-gray-50 hover:shadow-lg">
                  <Image
                    src={shcoolTraining.card_image ?? ""}
                    alt={shcoolTraining.name_en}
                    width={50}
                    height={50}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-sm font-medium truncate max-w-36 mt-2">
                  {shcoolTraining.name_en}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {corporateTeamBuilding && (
        <div className="space-y-12 mt-16 mb-16">
          <h2 className="text-2xl w-[95vw] ml-1 lg:ml-0 md:w-[70vw] lg:w-[80vw] font-semibold border-b pb-2 text-center flex flex-row justify-center">
            Corporate Team Building
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {corporateTeamBuilding.map((element, j) => (
              <Link
                key={j}
                href={`/admin/dashboard/trainingsBooking/${element.id}`}
                className="group flex flex-col items-center gap-2 text-center hover:scale-105 transition-transform duration-500 ease-in-out"
              >
                <div className="w-44 h-44 rounded-full overflow-hidden flex items-center justify-center border shadow-md bg-gray-50 hover:shadow-lg">
                  <Image
                    src={element.card_image ?? "DefaultImage"}
                    alt={element.name_en}
                    width={50}
                    height={50}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-sm font-medium truncate max-w-36 mt-2">
                  {element.name_en}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
