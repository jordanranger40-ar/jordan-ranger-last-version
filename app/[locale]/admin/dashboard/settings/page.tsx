import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SquarePen, Plus } from "lucide-react";
import DeleteSettingButton from "@/components/settings/deleteSetting";
import { deleteSetting } from "./(fetch)/deleteSetting";
import { getSettingsData } from "@/app/models/db/lib/services/settings";

export default async function SettingsTable() {
  const settings = await getSettingsData();
  console.log("settings: ", settings);

  return (
    <main className="flex flex-col justify-center items-center xl:ml-5 m-2">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Settings</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of your Settings.
        </h2>
      </div>

      {/* If no Settings */}
      {settings.length === 0 ? (
        <div className="w-full text-center py-10 text-gray-500 text-lg min-w-[75vw]">
          No Settings found. Please add a new Setting.
        </div>
      ) : (
        /* Table container */
        <div className="w-full overflow-x-auto border border-gray-300 rounded-2xl p-2">
          <div className="min-w-[75vw]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Setting Name</TableHead>
                  <TableHead className="hidden xl:table-cell">Setting Value</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((setting, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs sm:text-base">
                      {setting.key_name_en}
                    </TableCell>

                    {/* Value */}
                    <TableCell className="text-xs sm:text-base hidden xl:table-cell ">
                      {setting.value_en
                        ? setting.value_en.length > 50
                          ? setting.value_en?.substring(0, 50)
                          : setting.value_en
                        : ""}
                    </TableCell>

                    {/* Created At */}
                    <TableCell className="text-xs sm:text-base">
                      {setting.created_at?.toLocaleDateString()}
                    </TableCell>

                    {/* Edit Icon */}
                    <TableCell>
                      <div className="flex items-center gap-[6px]">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/admin/dashboard/settings/${setting.id}`}
                              >
                                <SquarePen className="w-5 h-5 text-[#125892] cursor-pointer hover:text-[#0f4473]" />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              <p>Edit</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <DeleteSettingButton
                          settingId={setting.id ?? ""}
                          deleteAction={deleteSetting}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Add Button under the table */}
      <div className="w-full flex justify-end mt-4">
        <Link
          href="/admin/dashboard/settings/newSetting"
          className="bg-[#125892] hover:bg-[#0f4473] text-white px-5 py-3 rounded-md flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </Link>
      </div>
    </main>
  );
}
