import React from "react";
import EditRoomForm from "@/components/rooms/editRoomForm"
import { editRoom } from "../(fetch)/editRoom";
import { getRoomById } from "@/app/models/db/lib/services/rooms";
async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const room = await getRoomById(params.id);

  return (
   <>
   <EditRoomForm room={room}  action={editRoom}/>
   </>
  );
}

export default page;
