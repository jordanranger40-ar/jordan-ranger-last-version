import { roomFeaturesColumns } from "@/components/columns/features-columns";
import { DataTable } from "@/components/data-table";
import { deleteFeature } from "./(fetch)/deleteFeature";
import { getAllFeatures } from "@/app/models/db/lib/services/rooms_features";
export default async function RoomsFeaturesTable() {
  const allFeatures = await getAllFeatures();
  return (
    <main className="flex flex-col justify-center items-center ml-7 w-[80vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Rooms Features</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of Rooms Features.
        </h2>
      </div>

      {/* Table container */}
      <DataTable columns={roomFeaturesColumns} data={allFeatures} routeName="room_features" deleteAction={deleteFeature}/>
    </main>
  );
}
