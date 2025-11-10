import React from "react";
import CreateNewTraining from "@/components/training/createNewTraining"
import { addTraining } from "../(fetch)/createNewTraining";
async function page() {
  

  return (
   <>
   <CreateNewTraining  action={addTraining}/>
   </>
  );
}

export default page;
