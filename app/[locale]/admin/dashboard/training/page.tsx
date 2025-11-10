import { trainingColumns } from "@/components/columns/training-columns";
import { DataTable } from "@/components/data-table";
import { deleteTraining } from "./(fetch)/deleteTraining";
import NavigationButton from "@/components/NavigationButton";
import { getAllTraining } from "@/app/models/db/lib/services/training";
export default async function TrainingTable() {
  const allTraining = (await getAllTraining()).data;
  return (
    <main className="flex flex-col justify-center items-center ml-7 w-[75vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Trainings </h1>
        <h2 className="text-sm md:text-lg text-gray-600">A list of The Training Programms.</h2>
      </div>

      {/* Table container */}
      <DataTable
        columns={trainingColumns}
        data={allTraining}
        routeName="training"
        deleteAction={deleteTraining}
      />

      <NavigationButton routeName="newTraining" value="Add New Training"/>
    </main>
  );
}
