
import { getSettingsData } from "@/app/models/db/lib/services/settings";
import { settingsColumns } from "@/components/columns/setting-columns";
import { DataTable } from "@/components/data-table";
import NavigationButton from "@/components/NavigationButton"
import { deleteSettingAction } from "./(fetch)/deleteSetting";
export default async function SettingsTable() {
  const settings = await getSettingsData();
  return (
    <main className="flex flex-col justify-center items-center ml-7 w-[88vw] md:w-[60vw] xl:w-[80vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Settings</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of your Settings.
        </h2>
      </div>
      {/* Table container */}
      <DataTable columns={settingsColumns} data={settings} routeName="settings" deleteAction={deleteSettingAction}/>
      <NavigationButton
            routeName="newSetting"
            value="Add New Setting"
          />
    </main>
  );
}
