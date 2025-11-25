import React from "react";
import { disableBookingRange } from "../(fetch)/disableBookingRange";
import CreateDisableBookingForm from "@/components/disableBooking/newDisableBooking";
import { getRoomsNameAndId } from "@/app/models/db/lib/services/rooms";
import { getActivitiesNameAndId } from "@/app/models/db/lib/services/activities";

async function page() {
  // Fetch results
  const roomsResult = await getRoomsNameAndId();
  const activitiesResult = await getActivitiesNameAndId();

  // Normalize to always be arrays
  const rooms =
    Array.isArray(roomsResult) && roomsResult.every(r => r.id && r.name_en)
      ? roomsResult
      : [];
  const activities =
    Array.isArray(activitiesResult) && activitiesResult.every(a => a.id && a.name_en)
      ? activitiesResult
      : [];

  return (
    <CreateDisableBookingForm
      rooms={rooms}
      activities={activities}
      action={disableBookingRange}
    />
  );
}

export default page;
