import React from "react";
import { addActivityAction } from "../(fetch)/createNewActivity";
import CreateActivityForm from "@/components/activities/dashboardComponents/createNewActivityForm";
async function page() {
  

  return (
   <>
   <CreateActivityForm   action={addActivityAction}/>
   </>
  );
}

export default page;
