import React from "react";
import CreateCourseForm from "@/components/courses/createCourseForm"
import { createnewCourse } from "../(fetch)/createNewCourse";
import { getAllTraining } from "@/app/models/db/lib/services/training";

  const training= await getAllTraining()
async function page() {
  

  return (
   <>
   <CreateCourseForm  action={createnewCourse} training={training}/>
   </>
  );
}

export default page;
