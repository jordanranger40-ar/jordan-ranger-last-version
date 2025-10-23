import { newCareer } from "@/types";
import pool from "..";

export const createNewApplication = async (application: newCareer) => {
  const result = await pool.query<newCareer>(
    "insert into careers (first_name,last_name, email,phone_number,city,cv) values ($1,$2,$3,$4,$5,$6) returning *",
    [
      application.first_name,
      application.last_name,
      application.email,
      application.phone_number,
      application.city,
      application.cv,
    ]
  );

  return result.rows
};

export const getAllApplications = async () => {
  const result = await pool.query<newCareer>("select * from careers ");
  return result.rows;
};


export const deleteApplications = async (id: string) => {
  const isValidId = await pool.query("select * from careers where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query("delete from careers where id=$1", [id]);
    return result.rows;
  }
};

export const getApplicationById= async (id:string)=>{
     const result = await pool.query<newCareer>("select * from careers where id=$1 ",[id]);
  return result.rows;
}
