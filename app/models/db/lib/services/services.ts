import pool from "../index";

import {type newService, type getService } from "@/types/index";

export const addNewService = async (newService: newService) => {
  const result = await pool.query<newService>(
    "insert into services (name_en,name_ar,description_en,description_ar,category_id,image) values ($1,$2,$3,$4,$5,$6) returning *",
    [
      newService.name_en,
      newService.name_ar,
      newService.description_en,
      newService.description_ar,
      newService.category_id,
      newService.image
    ]
  );

  return result.rows;
};

export const getAllServices = async () => {
  const result = await pool.query<getService>(
    "SELECT services. *, accommodation.id AS category_id, accommodation.category_name_en, accommodation.category_name_ar, accommodation.description_en,accommodation.description_ar FROM services INNER JOIN accommodation ON services.category_id = accommodation.id"
  );
  return result.rows;
};

export const editService = async (id: string, modifiedService: newService) => {
  const isValidId = await pool.query("select * from services where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query<newService>(
      " update services  set name_en= coalesce ($2,name_en ), name_ar = coalesce ($3,name_ar ) ,description_en = coalesce ($4,description_en) ,description_ar = coalesce($5,description_ar),category_id= coalesce($6,category_id), image= coalesce($7,image) where id= $1 returning * ",
      [
        id,
        modifiedService.name_en,
        modifiedService.name_ar,
        modifiedService.description_en,
        modifiedService.description_ar,
        modifiedService.category_id,
        modifiedService.image
      ]
    );
    return result.rows;
  }
};


export const deleteService = async (id: string) => {
  const isValidId = await pool.query("select * from services where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query("delete from services where id=$1", [id]);
    return result.rows;
  }
};
export const getServiceByCategoryId = async (id: string) => {
  const result = await pool.query("SELECT * FROM services WHERE category_id=$1", [id]);
  return result.rows;
}

export const getServiceById = async (id: string) => {
  const result = await pool.query("SELECT * FROM services WHERE id=$1", [id]);
  return result.rows;
}
