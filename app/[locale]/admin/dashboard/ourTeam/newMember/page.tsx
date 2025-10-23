import React from "react";
import CreateNewMemberForm from "@/components/ourTeam/createNewMember"
import { createMember } from "../(fetch)/addNewMember";
async function page() {
  

  return (
   <>
   <CreateNewMemberForm  action={createMember}/>
   </>
  );
}

export default page;
