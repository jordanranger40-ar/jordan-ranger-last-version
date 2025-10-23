import React from "react";
import { getMemberById } from "@/app/models/db/lib/services/outTeam";
import { editMember } from "../(fetch)/editMember";
import EditMemberForm from "@/components/ourTeam/editMemberForm";
async function page(prop: { params: Promise<{ id: string }> }) {
  const params = await prop.params;
  const members = await getMemberById(params.id);
  console.log("members: ",members);
  
  console.log("members: ",members);
  

  return (
    <div>
      <EditMemberForm member={members[0]} action={editMember} />
      
    </div>
  );
}

export default page;
