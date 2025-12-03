import pool from "../index";
import { newActivity } from "@/types/index";

export const addNewActivity = async (newActivity: newActivity) => {
  const result = await pool.query<newActivity>(
    "INSERT INTO activities (name_en,  name_ar, description_en, description_ar, location_type_en,location_type_ar, card_image, header_image,poster_image,capacity,price,slug,minimum_quantity,coming_soon ) VALUES ($1,$2,$3,$4,$5,$6, $7,$8,$9,$10,$11,$12,$13,$14) RETURNING *",
    [
      newActivity.name_en,
      newActivity.name_ar,
      newActivity.description_en,
      newActivity.description_ar,
      newActivity.location_type_en,
      newActivity.location_type_ar,
      newActivity.card_image,
      newActivity.header_image,
      newActivity.poster_image,
      newActivity.capacity,
      newActivity.price,
      newActivity.slug,
      newActivity.minimum_quantity,
      newActivity.coming_soon
    ]
  );

  return {
    result: result.rows,
    message: "The Activity Has Been Added Successfully",
    status: 201,
  };
};

export const getAllActivities = async () => {
  const result = await pool.query(" select * from activities ");

  return { result: result.rows, message: "All Activities", status: 200 };
};

export const editActivity = async (
  id: string,
  modifiedActivity: newActivity
) => {
  const result = await pool.query<newActivity>(
    "update activities set name_en= coalesce($1,name_en), name_ar= coalesce($2,name_ar), description_en= coalesce($3,description_en),  description_ar= coalesce ($4, description_ar), location_type_en= coalesce ($5,location_type_en), location_type_ar= coalesce ($6,location_type_ar), card_image= coalesce ($7,card_image),header_image= coalesce ($8,header_image),poster_image= coalesce ($9,poster_image), capacity= coalesce ($10,capacity),price= coalesce ($11,price),slug= coalesce ($12,slug),minimum_quantity= coalesce ($13,minimum_quantity),coming_soon= coalesce ($14,coming_soon)  where id=$15  returning * ",
    [
      modifiedActivity.name_en,
      modifiedActivity.name_ar,
      modifiedActivity.description_en,
      modifiedActivity.description_ar,
      modifiedActivity.location_type_en,
      modifiedActivity.location_type_ar,
      modifiedActivity.card_image,
      modifiedActivity.header_image,
      modifiedActivity.poster_image,
      modifiedActivity.capacity,
      modifiedActivity.price,
      modifiedActivity.slug,
      modifiedActivity.minimum_quantity,
      modifiedActivity.coming_soon,
      id,
    ]
  );

  return {
    result: result.rows,
    message: "The Activity Has Been Updated Successfully",
    status: 201,
  };
};

export const deleteActivityById = async (id: string) => {
  const result = await pool.query(
    " delete from activities where id=$1 returning *",
    [id]
  );

  return result.rows;
};

export const getActivityById = async (id: string) => {
  const result = await pool.query(" select * from activities where id=$1 ", [
    id,
  ]);

  return result.rows;
};

export const getActivityBySlug = async (slug: string) => {
  const result = await pool.query<newActivity>(
    " select * from activities where slug=$1 ",
    [slug]
  );
  return result.rows;
};
export const getActivityByType = async (location_type_en: string) => {
  const result = await pool.query<newActivity>(
    " select * from activities where location_type_en=$1 ",
    [location_type_en]
  );

  return result.rows;
};

export const getActivitiesNameAndId= async ()=>{

  try {
    const result= await pool.query<{ id: string; name_en: string }>("select id,name_en from activities")
    return result.rows
  } catch (error) {
    console.log(error);
    return "Error In Getting The Activities Names And ID"
    
  }
}

export const getComingSoonActivities= async ()=>{

  try {
    const result= await pool.query<newActivity>("select * from activities where coming_soon=true")
    return result.rows
  } catch (error) {
    console.log(error);
    return "Error In Getting Coming Soon Activities"
    
  }
}
