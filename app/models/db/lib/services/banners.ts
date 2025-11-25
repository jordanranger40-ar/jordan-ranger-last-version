"use server";


import { newBanner } from "@/types";
import pool from "../index";

export const addNewBanner = async (newBanner: newBanner) => {
  const result = await pool.query(
    "insert into banners (alt, description_en, description_ar, image) values ($1,$2,$3,$4)",
    [
      newBanner.alt,
      newBanner.description_en,
      newBanner.description_ar,
      newBanner.image,
    ]
  );

  return result.rows;
};

export const getBannerData = async () => {
  const result = await pool.query<newBanner>("select * from banners");

  return result.rows;
};

export const getBannerbyId = async (id: string) => {
  const result = await pool.query<newBanner>(
    "select * from banners where id=$1",
    [id]
  );

  return result.rows;
};

export const editBanner = async (id: string, modifiedCategory: newBanner) => {
  const isValidId = await pool.query("select * from banners where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query<newBanner>(
      " update banners set alt= coalesce ($2,alt ), description_en = coalesce ($3,description_en) ,description_ar = coalesce($4,description_ar),image= coalesce($5,image) where id= $1 returning * ",
      [
        id,
        modifiedCategory.alt,
        modifiedCategory.description_en,
        modifiedCategory.description_ar,
        modifiedCategory.image,
      ]
    );
    return result.rows;
  }
};

export const deleteBanner = async (id: string) => {
  const isValidId = await pool.query("select * from banners where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query("delete from banners where id=$1", [id]);
    return result.rows;
  }
};
