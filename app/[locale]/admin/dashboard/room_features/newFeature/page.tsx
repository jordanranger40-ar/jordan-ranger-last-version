import React from "react";
import CreateNewFeature from "@/components/room_features/newRoomFeatureForm"
import { addFeatureAction } from "../(fetch)/addFeature";
async function page() {
  

  return (
   <>
   <CreateNewFeature  action={addFeatureAction}/>
   </>
  );
}

export default page;
