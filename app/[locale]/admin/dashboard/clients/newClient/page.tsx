import React from "react";
import CreateNewClientForm from "@/components/clients/createNewClientForm"
import { createClientAction } from "../(fetch)/createNewClient";
async function page() {
  

  return (
   <>
   <CreateNewClientForm  action={createClientAction}/>
   </>
  );
}

export default page;
