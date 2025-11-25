// components/DateRangeFilter.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

export default function DateRangeTrainingFilter({ start, end }: { start?: string; end?: string }) {
  const [startDate, setStartDate] = useState<Date | undefined>(start ? new Date(start) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(end ? new Date(end) : undefined);

  const clearLocal = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="flex flex-col lg:gap-6 gap-1 lg:flex lg:flex-row justify-start">
      {/* Start Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Start Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start text-left">
              <CalendarIcon className="h-4 w-4 " />
              {startDate ? format(startDate, "yyyy-MM-dd") : "Select date"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-0">
            <Calendar mode="single" selected={startDate} onSelect={(date) => setStartDate(date ?? undefined)} />
          </PopoverContent>
        </Popover>

        {/* Hidden input for GET (will be submitted by parent form) */}
        <input type="hidden" name="start" value={startDate ? format(startDate, "yyyy-MM-dd") : ""} />
      </div>

      {/* End Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">End Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start text-left">
              <CalendarIcon className="h-4 w-4 " />
              {endDate ? format(endDate, "yyyy-MM-dd") : "Select date"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-0">
            <Calendar mode="single" selected={endDate} onSelect={(date) => setEndDate(date ?? undefined)} />
          </PopoverContent>
        </Popover>

        <input type="hidden" name="end" value={endDate ? format(endDate, "yyyy-MM-dd") : ""} />
      </div>

      {/* Local clear button (optional) */}
      <div className="flex items-end">
        {(startDate || endDate) && (
          <Button type="button" variant="ghost" onClick={clearLocal} className="text-sm">
            Clear dates
          </Button>
        )}
      </div>
    </div>
  );
}
