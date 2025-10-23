import React from "react";
import { editCourse } from "../(fetch)/editCourse";
import EditCourseForm from "@/components/courses/editCourseForm";
import { getAllTraining } from "@/app/models/db/lib/services/training";
import { getCourseByCourseId } from "@/app/models/db/lib/services/courses";

async function page(prop: { params: Promise<{ id: string }> }) {
  const params = await prop.params;
  console.log("params.id: ",params.id);
  
  const course = await getCourseByCourseId(params.id) ;
  const training= await getAllTraining()
  console.log(" awdwa:",training);
  
  console.log("category: ",course);
  

  return (
    <div>
      <EditCourseForm course={course[0]} action={editCourse} training={training} />
    </div>
  );
}

export default page;

