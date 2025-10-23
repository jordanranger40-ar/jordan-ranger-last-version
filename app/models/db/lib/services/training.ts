import pool from "../index";

import { newTraining } from "@/types/index";

export const addNewTraining = async (newTraining: newTraining) => {
  const result = await pool.query<newTraining>(
    "insert into training (name_en, name_ar,description_en,description_ar) values ($1,$2,$3,$4) returning *",
    [
      newTraining.name_en,
      newTraining.name_ar,
      newTraining.description_en,
      newTraining.description_ar,
    ]
  );

  return result.rows;
};

export const getAllTraining = async () => {
  const result = await pool.query<newTraining>("select * from training");
  return result.rows;
};

export const editTraining = async (
  id: string,
  modifiedTraining: newTraining
) => {
  const isValidId = await pool.query("select * from training where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query<newTraining>(
      " update training set name_en= coalesce ($2,name_en ), name_ar = coalesce ($3,name_ar ) ,description_en = coalesce ($4,description_en) ,description_ar = coalesce($5,description_ar) where id= $1 returning * ",
      [
        id,
        modifiedTraining.name_en,
        modifiedTraining.name_ar,
        modifiedTraining.description_en,
        modifiedTraining.description_ar
      ]
    );
    return result.rows;
  }
};

export const deleteTraining = async (id: string) => {
  const isValidId = await pool.query("select * from training where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query("delete from training where id=$1", [id]);
    return result.rows;
  }
};



export const getTrainingById  = async (id: string) => {
  const result = await pool.query<newTraining>(
    "SELECT * FROM training WHERE id=$1", [id]
  );
  return result.rows;
};
