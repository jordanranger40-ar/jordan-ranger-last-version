import React from "react";
import { getFeatureById } from "@/app/models/db/lib/services/rooms_features";
import EditfeatureForm from "@/components/room_features/editRoomFeatureForm"
import { editFeature } from "../(fetch)/editFeature";
async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const feature = await getFeatureById(params.id);
  console.log(feature);

  return (
   <>
   <EditfeatureForm feature={feature[0]}  action={editFeature}/>
   </>
  );
}

export default page;
