import pool from "../index";

import type { newCourse, getCourses } from "@/types/index";

export const addNewCourse = async (newCourse: newCourse) => {
  const result = await pool.query<newCourse>(
    "insert into courses (title_en, title_ar,description_en, description_ar, target_audience_en, target_audience_ar, delivery_method_en, delivery_method_ar, duration_en, duration_ar, training_id,image) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning *",
    [
      newCourse.title_en,
      newCourse.title_ar,
      newCourse.description_en,
      newCourse.description_ar,
      newCourse.target_audience_en,
      newCourse.target_audience_ar,
      newCourse.delivery_method_en,
      newCourse.delivery_method_ar,
      newCourse.duration_en,
      newCourse.duration_ar,
      newCourse.training_id,
      newCourse.image
    ]
  );

  return result.rows;
};

export const getAllCourses = async () => {
  const result = await pool.query<getCourses>(
    `SELECT 
     courses.*, 
     training.id AS training_id, 
     training.name_en AS training_name_en, 
     training.name_ar AS training_name_ar, 
     training.description_en AS training_description_en, 
     training.description_ar AS training_description_ar
   FROM courses
   INNER JOIN training 
   ON courses.training_id = training.id;`
  );
  return result.rows;
};

export const editCourse = async (id: string, modifiedCourse: newCourse) => {
  const isValidId = await pool.query("select * from courses where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query<newCourse>(
      " update courses set title_en= coalesce ($2,title_en ), title_ar = coalesce ($3,title_ar ) ,description_en = coalesce ($4,description_en) ,description_ar = coalesce($5,description_ar), target_audience_en= coalesce($6,target_audience_en), target_audience_ar= coalesce($7,target_audience_ar), delivery_method_en=coalesce($8,delivery_method_en), delivery_method_ar=coalesce($9,delivery_method_ar), duration_en= coalesce($10,duration_en), duration_ar= coalesce($11,duration_ar), training_id= coalesce($12,training_id), image= coalesce($13,image) where id= $1 returning * ",
      [
        id,
        modifiedCourse.title_en,
        modifiedCourse.title_ar,
        modifiedCourse.description_en,
        modifiedCourse.description_ar,
        modifiedCourse.target_audience_en,
        modifiedCourse.target_audience_ar,
        modifiedCourse.delivery_method_en,
        modifiedCourse.delivery_method_ar,
        modifiedCourse.duration_en,
        modifiedCourse.duration_ar,
        modifiedCourse.training_id,
        modifiedCourse.image
      ]
    );
    return result.rows;
  }
};

export const deleteCoruse = async (id: string) => {
  const isValidId = await pool.query("select * from courses where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query("delete from courses where id=$1", [id]);
    return result.rows;
  }
};

export const getCourseById = async (id: string) => {
  // this for the Training ID
  const result = await pool.query<getCourses>(
    "SELECT * FROM courses WHERE training_id=$1",
    [id]
  );
  return result.rows;
};

export const getCourseByCourseId = async (id: string) => {
  const result = await pool.query<getCourses>(
    "SELECT * FROM courses WHERE id=$1",
    [id]
  );
  return result.rows;
};
