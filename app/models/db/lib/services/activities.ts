import pool from "../index";
import { newActivity } from "@/types/index";

export const addNewActivity = async (newActivity: newActivity) => {
  
  const result = await pool.query<newActivity>(
    "INSERT INTO activities (name_en,  name_ar, description_en, description_ar, location_type_en,location_type_ar, image,capacity,price ) VALUES ($1,$2,$3,$4,$5,$6, $7,$8,$9) RETURNING *",
    [
      newActivity.name_en,
      newActivity.name_ar,
      newActivity.description_en,
      newActivity.description_ar,
      newActivity.location_type_en,
      newActivity.location_type_ar,
      newActivity.image,
      newActivity.capacity,
      newActivity.price,
    ]
  );

   return {result:result.rows,message:"The Activity Has Been Added Successfully",status:201}
};

export const getAllActivities = async () => {
  const result = await pool.query(
    " select * from activities "
  );

  return {result:result.rows,message:"All Activities",status:200};
};

export const editActivity = async (id: string, modifiedActivity: newActivity) => {
  const result = await pool.query<newActivity>(
    "update activities set name_en= coalesce($1,name_en), name_ar= coalesce($2,name_ar), description_en= coalesce($3,description_en),  description_ar= coalesce ($4, description_ar), location_type_en= coalesce ($5,location_type_en), location_type_ar= coalesce ($6,location_type_ar), image= coalesce ($7,image), capacity= coalesce ($8,capacity),price= coalesce ($9,price) where id=$10  returning * ",
    [
      modifiedActivity.name_en,
      modifiedActivity.name_ar,
      modifiedActivity.description_en,
      modifiedActivity.description_ar,
      modifiedActivity.location_type_en,
      modifiedActivity.location_type_ar,
      modifiedActivity.image,
      modifiedActivity.capacity,
      modifiedActivity.price,
      id,
    ]
  );

 
    return {result:result.rows,message:"The Activity Has Been Updated Successfully",status:201};
  
};

export const deleteActivityById = async (id: string) => {

  const result = await pool.query(
    " delete from activities where id=$1 returning *",
    [id]
  );

  return result.rows;
};

export const getActivityById = async (id: string) => {
  const result = await pool.query(
    " select * from activities where id=$1 ",
    [id]
  );

  return result.rows;
};
