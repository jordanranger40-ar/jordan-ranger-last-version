import React from "react";
import CreateNewTraining from "@/components/training/createNewTraining"
import { createTraining } from "../(fetch)/createNewTraining";
async function page() {
  

  return (
   <>
   <CreateNewTraining  action={createTraining}/>
   </>
  );
}

export default page;
