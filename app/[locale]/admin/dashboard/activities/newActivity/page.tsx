import React from "react";
import { addActivity } from "../(fetch)/createNewActivity";
import CreateActivityForm from "@/components/activities/dashboardComponents/createNewActivityForm";
async function page() {
  

  return (
   <>
   <CreateActivityForm   action={addActivity}/>
   </>
  );
}

export default page;
