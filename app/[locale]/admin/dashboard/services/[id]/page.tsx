import React from "react";
import { getServiceById } from "@/app/models/db/lib/services/services";
import { editService } from "../(fetch)/editService";
import EditServiceForm from "@/components/services/editServiceForm";
import { getAllcategories } from "@/app/models/db/lib/services/Accommodation";

async function page(prop: { params: Promise<{ id: string }> }) {
  const params = await prop.params;
  const service = await getServiceById(params.id);
  console.log("servicewdw33: ", service);

  const categories = await getAllcategories();
  console.log(" awdwa:", categories);

  console.log("category: ", service);

  return (
    <div>
      <EditServiceForm
        service={service[0]}
        action={editService}
        categories={categories}
      />
    </div>
  );
}

export default page;
