import pool from "../index";

import { newTraining } from "@/types/index";

export const addNewTraining = async (newTraining: newTraining) => {
  console.log("ebfebjn");
  const result = await pool.query<newTraining>(
    "insert into training (name_en, name_ar,description_en,description_ar, category_en ,category_ar, price, capacity,start_date,end_date,image,slug ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning *",
    [
      newTraining.name_en,
      newTraining.name_ar,
      newTraining.description_en,
      newTraining.description_ar,
      newTraining.category_en,
      newTraining.category_ar,
      newTraining.price,
      newTraining.capacity,
      newTraining.start_date,
      newTraining.end_date,
      newTraining.image,
      newTraining.slug
    ]
  );


  return {
    data: result.rows,
    message: "Training Has Been Added Successfully",
    status: 201,
  };
};

export const getAllTraining = async () => {
  const result = await pool.query<newTraining>("select * from training");
  return { data: result.rows, message: "All Trainings", status: 200 };
};

export const editTraining = async (
  id: string,
  modifiedTraining: newTraining
) => {
  const isValidId = await pool.query("select * from training where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return { data: null, message: "No Training With This ID", status: 409 };
  } else {
    const result = await pool.query<newTraining>(
      " update training set name_en= coalesce ($2,name_en ), name_ar = coalesce ($3,name_ar ) ,description_en = coalesce ($4,description_en) ,description_ar = coalesce($5,description_ar), category_en = coalesce($6,category_en), category_ar = coalesce($7,category_ar), price = coalesce($8,price), capacity = coalesce($9,capacity), start_date = coalesce($10,start_date),end_date = coalesce($11,end_date),image = coalesce($12,image),slug = coalesce($13,slug) where id= $1 returning * ",
      [
        id,
        modifiedTraining.name_en,
        modifiedTraining.name_ar,
        modifiedTraining.description_en,
        modifiedTraining.description_ar,
        modifiedTraining.category_en,
        modifiedTraining.category_ar,
        modifiedTraining.price,
        modifiedTraining.capacity,
        modifiedTraining.start_date,
        modifiedTraining.end_date,
        modifiedTraining.image,
        modifiedTraining.slug
      ]
    );
    return {
      data: result.rows,
      message: "Training Has Been Updated Successfully",
      status: 201,
    };
  }
};

export const deleteTraining = async (id: string) => {
  const isValidId = await pool.query("select * from training where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return { data: null, message: "No Training With This ID", status: 409 };
  } else {
    const result = await pool.query("delete from training where id=$1", [id]);
    return {
      data: result.rows,
      message: "Training Has Been Deleted Successfully",
      status: 201,
    };
  }
};

export const getTrainingById = async (id: string) => {
  const result = await pool.query<newTraining>(
    "SELECT * FROM training WHERE id=$1",
    [id]
  );
  return { data: result.rows, message: "Training With This ID:", status: 201 };
};

export const getTrainingBySlug = async (slug: string) => {
  const result = await pool.query<newTraining>(
    "SELECT * FROM training WHERE slug=$1",
    [slug]
  );
  return { data: result.rows, message: "Training With This slug:", status: 201 };
};

