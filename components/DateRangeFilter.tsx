"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, XCircle, SlidersHorizontal } from "lucide-react";

export default function DateRangeFilter({ start, end }: { start?: string; end?: string }) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    start ? new Date(start) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    end ? new Date(end) : undefined
  );

  const clearFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);

    // Force clearing the URL query params
    window.location.href = window.location.pathname;
  };

  return (
    <form method="GET" className="flex items-end gap-6 mb-6 w-full justify-start">
      {/* Start Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Start Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start text-left">
              <CalendarIcon className=" h-4 w-4" />
              {startDate ? format(startDate, "yyyy-MM-dd") : "Select date"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => setStartDate(date ?? undefined)}
            />
          </PopoverContent>
        </Popover>

        <input
          type="hidden"
          name="start"
          value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
        />
      </div>

      {/* End Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">End Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start text-left">
              <CalendarIcon className=" h-4 w-4" />
              {endDate ? format(endDate, "yyyy-MM-dd") : "Select date"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-0 ">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => setEndDate(date ?? undefined)}
            />
          </PopoverContent>
        </Popover>

        <input
          type="hidden"
          name="end"
          value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button type="submit" className="bg-[#676e32] text-white  rounded-md cursor-pointer hover:bg-[#7b8444] transition">
        <SlidersHorizontal/>  Filter
        </Button>

        {(startDate || endDate) && (
          <Button
            type="button"
            variant="destructive"
            className="px-4 flex items-center gap-1 cursor-pointer"
            onClick={clearFilter}
          >
            <XCircle className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>
    </form>
  );
}
