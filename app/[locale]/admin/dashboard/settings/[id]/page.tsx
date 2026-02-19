import { getSettingbyId } from "@/app/models/db/lib/services/settings";
import { editSettingAction } from "../(fetch)/editSetting";
import EditSettingForm from "@/components/settings/editSettingForm";
async function page(prop: { params: Promise<{ id: string }> }) {
  const params = await prop.params;
  const setting = await getSettingbyId(params.id);
  

  return (
    <div>
      <EditSettingForm setting={setting[0]} action={editSettingAction} />
    </div>
  );
}

export default page;


