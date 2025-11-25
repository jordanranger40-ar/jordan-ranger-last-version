import DisableBookingClient from "@/components/disableBooking/DisableBookingClient";
import { getAllDisabledDates } from "@/app/models/db/lib/services/booking_disabled_dates";
import { getActivitiesNameAndId } from "@/app/models/db/lib/services/activities";
import { getRoomsNameAndId } from "@/app/models/db/lib/services/rooms";
import {DisableBookingData} from "@/types/index"

export default async function DisableBookingTablePage() {
  const allDisabledDatesRaw = (await getAllDisabledDates()).data || [];
  const activitiesResult  = await getActivitiesNameAndId(); 
  const roomsResult = await getRoomsNameAndId();

  const activities = Array.isArray(activitiesResult) ? activitiesResult : [];
const rooms = Array.isArray(roomsResult) ? roomsResult : [];

const activityMap: Record<string, string> = Object.fromEntries(
  activities.map((a) => [a.id, a.name_en])
);

const roomMap: Record<string, string> = Object.fromEntries(
  rooms.map((r) => [r.id, r.name_en])
);

  const allDisabledDates = allDisabledDatesRaw.map((d: DisableBookingData) => ({
    ...d,
    start_date: d.start_date ? new Date(d.start_date).toISOString() : null,
    end_date: d.end_date ? new Date(d.end_date).toISOString() : null,
  }));

  return (
    <DisableBookingClient
      initialData={allDisabledDates}
      activityMap={activityMap}
      roomMap={roomMap}
    />
  );
}
