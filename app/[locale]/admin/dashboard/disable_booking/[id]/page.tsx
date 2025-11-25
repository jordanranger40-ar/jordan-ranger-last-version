import React from "react";
import { editDisabledBooking } from "../(fetch)/editDisableDate";
import EditDisableBookingForm from "@/components/disableBooking/editDisabledBooking";
import { getDisabledDateById } from "@/app/models/db/lib/services/booking_disabled_dates";
import { getActivitiesNameAndId } from "@/app/models/db/lib/services/activities";
import { getRoomsNameAndId } from "@/app/models/db/lib/services/rooms";
import type { DisableBookingData } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function page(props: PageProps) {
  const { id } = await props.params;

  const disabledBooking: DisableBookingData | null =
    (await getDisabledDateById(id)).data?.[0] || null;

  if (!disabledBooking) {
    return <p>Disabled booking not found.</p>;
  }

 const activitiesData = await getActivitiesNameAndId();
const activities: { id: string; name_en: string }[] = Array.isArray(activitiesData)
  ? activitiesData
  : [];

  const roomsData = await getRoomsNameAndId();
const rooms: { id: string; name_en: string }[] = Array.isArray(roomsData)
  ? roomsData
  : [];

  return (
    <EditDisableBookingForm
      initialData={disabledBooking} 
      action={editDisabledBooking}
      activities={activities}
      rooms={rooms}
    />
  );
}

export default page;
