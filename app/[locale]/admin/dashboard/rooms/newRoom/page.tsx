import React from "react";
import CreateRoomForm from "@/components/rooms/createRoomForm" 
import { addRoom } from "../(fetch)/addNewRoom";
async function page() {
  

  return (
   <>
   <CreateRoomForm   action={addRoom}/>
   </>
  );
}

export default page;
