import { activitiesBookingsColumns } from "@/components/columns/activitiesBooking-columns";
import { ActivityDataTable } from "@/components/Activity-data-table";
import { deleteActivityBookingAction } from "../(fetch)/deleteActivityBooking";
import { getActivityBookingByDate } from "@/app/models/db/lib/services/activity_booking";
import DateRangeFilter from "@/components/DateRangeFilter";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import { getActivityById } from "@/app/models/db/lib/services/activities";

interface Props {
  params: Promise<{id:string}>
  searchParams?: Promise <{ start?: string; end?: string, page?:number }>;

}

export default async function ActivitiesBookingTable({ searchParams,params }: Props) {
  const id= (await params).id
  
const date = searchParams ? await searchParams : {};
  const startDate = date?.start ? new Date(date.start) : null;
  const endDate = date?.end ? new Date(date.end) : null;
  const page= date.page
  const response = await getActivityBookingByDate(startDate, endDate,id,Number(page));
  const activity= await getActivityById(id)
  const allActivitiesBookings = response.data || [];

  return (
    <main className="flex flex-col lg:justify-center justify-start items-center lg:ml-7 ml-2   w-[88vw] md:w-[65vw] xl:w-[80vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Activity Bookings </h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list all Bookings On {activity[0].name_en}.
        </h2>
      </div>

      {/* Filter */}
      <DateRangeFilter start={date?.start} end={date?.end} />

      {/* No bookings message */}
      {allActivitiesBookings.length === 0 ? (
        <Card className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center text-center">
            <FolderOpen className="w-10 h-10 text-gray-400 mb-3" />
            <h3 className="text-gray-600 text-lg font-medium">
              No upcoming bookings found
            </h3>
            <p className="text-gray-500 text-sm">
              There are no bookings yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ActivityDataTable
          columns={activitiesBookingsColumns}
          data={allActivitiesBookings}
          routeName="activityBookingById"
          deleteAction={deleteActivityBookingAction}
          totalPages={response.meta.totalPages}
        />
      )}
    </main>
  );
}
