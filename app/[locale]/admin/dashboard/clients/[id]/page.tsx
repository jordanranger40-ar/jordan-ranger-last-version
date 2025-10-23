import React from "react";
import { getClientbyId } from "@/app/models/db/lib/services/clients";
import { editClient } from "../(fetch)/editClient";
import EditClientForm from "@/components/clients/editClientForm";
async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const client = await getClientbyId(params.id);
  console.log(client);

  return (
   <>
   <EditClientForm client={client[0]}  action={editClient}/>
   
   </>
  );
}

export default page;
