import React from "react";
import { editActivity } from "../(fetch)/editActivity";
import EditActivityForm from "@/components/activities/dashboardComponents/editActivityForm";
import { getActivityById } from "@/app/models/db/lib/services/activities";
async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const activity = await getActivityById(params.id);
  console.log(activity);

  return (
   <>
   <EditActivityForm activity={activity[0]}  action={editActivity}/>
   </>
  );
}

export default page;
