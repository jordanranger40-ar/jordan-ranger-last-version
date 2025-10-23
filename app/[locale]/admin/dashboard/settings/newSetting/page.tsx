import React from "react";
import { createSettings } from "../(fetch)/createNewSetting";
import CreateNewSetting from "@/components/settings/createNewSettingFrom";
import { getSettingsData } from "@/app/models/db/lib/services/settings";
async function page() {
  const settings = await getSettingsData();
  const existingKeys = settings
  .map((s) => s.key_name_en?.trim().toLowerCase())
  .filter((key): key is string => Boolean(key)); // remove undefined values


  return (
    <>
      <CreateNewSetting action={createSettings} existingKeys={existingKeys} />
    </>
  );
}

export default page;
