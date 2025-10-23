import React from "react";
import { getSettingbyId } from "@/app/models/db/lib/services/settings";
import { editSetting } from "../(fetch)/editSetting";
import EditSettingForm from "@/components/settings/editSettingForm";
async function page(prop: { params: Promise<{ id: string }> }) {
  const params = await prop.params;
  const setting = await getSettingbyId(params.id);
  console.log("setting: ",setting);
  

  return (
    <div>
      <EditSettingForm setting={setting[0]} action={editSetting} />
    </div>
  );
}

export default page;


