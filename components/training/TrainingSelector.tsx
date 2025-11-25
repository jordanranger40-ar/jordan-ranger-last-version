"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { newTraining } from "@/types";
interface TrainingSelectorProps {
  initialTrainingId?: string;
  trainings: newTraining[];
}

export default function TrainingSelector({ initialTrainingId, trainings }: TrainingSelectorProps) {
  const [selectedTraining, setSelectedTraining] = useState<string | undefined>(initialTrainingId);
  
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">Training</label>
      <Select
        onValueChange={(value) => setSelectedTraining(value)}
        defaultValue={initialTrainingId}
        name="training_id" 
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select training" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Trainings</SelectItem>
          {trainings.map((training) => (
            <SelectItem key={training.id} value={training.id??""}>
              {training.name_en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
       <input type="hidden" name="training_id" value={selectedTraining ?? ""} />
    </div>
  );
}
