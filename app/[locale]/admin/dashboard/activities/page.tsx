import { activitiesColumns } from "@/components/columns/activities-columns";
import { DataTable } from "@/components/data-table";
import { deleteActivity } from "./(fetch)/deleteActivity";
import NavigationButton from "@/components/NavigationButton";
import { getAllActivities } from "@/app/models/db/lib/services/activities";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

export default async function ActivitiesTable() {
  const AllActivities = (await getAllActivities()).result || [];

  return (
    <main className="flex flex-col justify-center items-center ml-7 w-[75vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Activities</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of Activities.
        </h2>
      </div>

      {/* Conditional rendering */}
      {AllActivities.length === 0 ? (
        <Card className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center text-center">
            <FolderOpen className="w-10 h-10 text-gray-400 mb-3" />
            <h3 className="text-gray-600 text-lg font-medium">
              No activities found
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              You haven’t added any activities yet.
            </p>
            <NavigationButton
              routeName="newActivity"
              value="Add New Activity"
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <DataTable
            columns={activitiesColumns}
            data={AllActivities}
            routeName="activities"
            deleteAction={deleteActivity}
          />
          <NavigationButton
            routeName="newActivity"
            value="Add New Activity"
          />
        </>
      )}
    </main>
  );
}
