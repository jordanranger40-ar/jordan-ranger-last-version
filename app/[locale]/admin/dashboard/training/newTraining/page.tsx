import React from "react";
import CreateNewTraining from "@/components/training/createNewTraining"
import { addTrainingAction } from "../(fetch)/createNewTraining";
async function page() {
  

  return (
   <>
   <CreateNewTraining  action={addTrainingAction}/>
   </>
  );
}

export default page;
