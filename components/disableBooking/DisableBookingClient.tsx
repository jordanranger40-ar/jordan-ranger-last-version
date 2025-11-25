"use client";

import React from "react";
import { DataTable } from "@/components/data-table";
import { deleteDisableBooking } from "@/app/[locale]/admin/dashboard/disable_booking/(fetch)/deleteDisabledDate"; 
import { disableBookingsColumns } from "@/components/columns/disableBooking-columns"; 
import type { DisableBookingData } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import NavigationButton from "@/components/NavigationButton";

interface Props {
  initialData: DisableBookingData[]; 
  activityMap: Record<string, string>;
  roomMap: Record<string, string>;
}

export default function DisableBookingClient({ initialData, activityMap, roomMap }: Props) {
  const columns = disableBookingsColumns(activityMap, roomMap);

  return (
    <main className="flex flex-col justify-center items-center ml-7 w-[75vw]">
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Disable Booking</h1>
        <h2 className="text-sm md:text-lg text-gray-600">A list of Disabled Booking.</h2>
      </div>

      {initialData.length === 0 ? (
        <Card className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center text-center">
            <FolderOpen className="w-10 h-10 text-gray-400 mb-3" />
            <h3 className="text-gray-600 text-lg font-medium">No Disabled Dates found</h3>
            <p className="text-gray-500 text-sm mb-4">You haven’t added any disable booking yet.</p>
            <NavigationButton routeName="newDisableBooking" value="Disable Booking" />
          </CardContent>
        </Card>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={initialData}
            routeName="disable_booking"
            deleteAction={deleteDisableBooking}
          />
          <NavigationButton routeName="newDisableBooking" value="Disable Booking" />
        </>
      )}
    </main>
  );
}
