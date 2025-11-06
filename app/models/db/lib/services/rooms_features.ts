import { roomFeatures } from "@/types";
import pool from "..";

export const getAllFeatures = async () => {
  const result = await pool.query<roomFeatures>("select * from room_features");
  return result.rows;
};

export const createNewFeature = async (data: roomFeatures) => {
  const insertfeature = await pool.query(
    "insert into room_features ( feature_title_en,feature_title_ar,feature_description_en,feature_description_ar) values ($1,$2,$3,$4) returning *",
    [
      data.feature_title_en,
      data.feature_title_ar,
      data.feature_description_en,
      data.feature_description_ar,
    ]
  );

  return insertfeature.rows[0];
};

export const editFeature = async (data: roomFeatures, id: string) => {
  const result = await pool.query(
    "update room_features set feature_title_en= coalesce($1,feature_title_en), feature_title_ar= coalesce($2,feature_title_ar), feature_description_en= coalesce($3,feature_description_en), feature_description_ar= coalesce ($4, feature_description_ar) where id=$5  returning * ",
    [
      data.feature_title_en,
      data.feature_title_ar,
      data.feature_description_en,
      data.feature_description_ar,
      id,
    ]
  );

  return result.rows[0];
};

export const deleteFeatureById = async (id: string) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "delete from rooms_with_features  where room_features_id=$1",
      [id]
    );

    await client.query("delete from room_features where id=$1", [id]);

    client.query("commit");
  } catch (error) {
    client.query("ROLLBACK");
    console.error("Error deleting feature:", error);
    throw error;
  } finally {
    client.release();
  }
};

export const getFeatureById= async (id:string)=>{
  const result= await pool.query<roomFeatures>(
    "select * from room_features where id=$1"
    ,[id]
  )

 return result.rows
}
