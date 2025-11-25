// components/training/TrainingFilterSAndD.tsx
"use client";

import React from "react";
import TrainingSelector from "./TrainingSelector";
import DateRangeTrainingFilter from "./DateRangeTrainingFilter";
import { newTraining } from "@/types";
import { Button } from "@/components/ui/button";

interface Props {
  start?: string;
  end?: string;
  initialTrainingId?: string;
  trainings: newTraining[];
}

export default function TrainingFilterSAndD({
  start,
  end,
  initialTrainingId,
  trainings,
}: Props) {
  return (
    <form
      method="GET"
      className="lg:flex lg:flex-row flex-wrap lg:gap-4 gap-3  w-full justify-start mb-10 flex flex-col"
    >
      <div className="flex flex-col lg:gap-4 gap-1 lg:flex lg:flex-row ">
        <DateRangeTrainingFilter start={start} end={end} />
        <TrainingSelector
          initialTrainingId={initialTrainingId}
          trainings={trainings}
        />
      </div>

      <div className="flex gap-3 lg:ml-auto ml-0 mt-2 lg:mt-0">
        {" "}
        <Button
          type="submit"
          className="bg-[#676e32] text-white rounded-md hover:bg-[#7b8444]"
        >
          Apply
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            window.location.href = window.location.pathname;
          }}
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
