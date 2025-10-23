import React from "react";
import CreateNewBanner from "@/components/banner/createNewBanner"
import { createBanner } from "../(actions)/addNewBanner";
async function page() {
  

  return (
   <>
   <CreateNewBanner  action={createBanner}/>
   </>
  );
}

export default page;
