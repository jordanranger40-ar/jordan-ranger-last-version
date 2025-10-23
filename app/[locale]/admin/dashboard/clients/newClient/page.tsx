import React from "react";
import CreateNewClientForm from "@/components/clients/createNewClientForm"
import { createClient } from "../(fetch)/createNewClient";
async function page() {
  

  return (
   <>
   <CreateNewClientForm  action={createClient}/>
   </>
  );
}

export default page;
