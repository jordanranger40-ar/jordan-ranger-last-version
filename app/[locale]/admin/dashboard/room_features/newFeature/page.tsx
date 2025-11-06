import React from "react";
import CreateNewFeature from "@/components/room_features/newRoomFeatureForm"
import { addFeature } from "../(fetch)/addFeature";
async function page() {
  

  return (
   <>
   <CreateNewFeature  action={addFeature}/>
   </>
  );
}

export default page;
