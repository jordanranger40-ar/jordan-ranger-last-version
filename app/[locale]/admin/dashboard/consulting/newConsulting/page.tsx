import React from "react";
import CreateNewCategory from "@/components/consulting/createNewCategory"
import { createCategory } from "../(fetch)/createNewCategory";
async function page() {
  

  return (
   <>
   <CreateNewCategory  action={createCategory}/>
   </>
  );
}

export default page;
