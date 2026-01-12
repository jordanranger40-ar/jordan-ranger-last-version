import React from "react";
import CreateRoomForm from "@/components/rooms/createRoomForm" 
import { addRoomAction } from "../(fetch)/addNewRoom";
async function page() {
  

  return (
   <>
   <CreateRoomForm   action={addRoomAction}/>
   </>
  );
}

export default page;
