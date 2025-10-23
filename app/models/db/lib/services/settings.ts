"use server";

import { newSetting } from "@/types";
import pool from "../index";

export const addNewSetting = async (newSetting: newSetting) => {
  const result = await pool.query(
    "insert into settings (key_name_en, key_name_ar, value_en, value_ar) values ($1,$2,$3,$4)",
    [
      newSetting.key_name_en,
      newSetting.key_name_ar,
      newSetting.value_en,
      newSetting.value_ar,
    ]
  );

  return result.rows;
};

export const getSettingsData = async () => {
  const result = await pool.query<newSetting>("select * from settings");

  return result.rows;
};

export const getSettingbyId = async (id: string) => {
  const result = await pool.query<newSetting>(
    "select * from settings where id=$1",
    [id]
  );

  return result.rows;
};

export const editSetting = async (id: string, modifiedSettings: newSetting) => {
  const isValidId = await pool.query("select * from settings where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query<newSetting>(
      " update settings set key_name_en= coalesce ($2,key_name_en ), key_name_ar = coalesce ($3,key_name_ar) ,value_en = coalesce($4,value_en),value_ar= coalesce($5,value_ar) where id= $1 returning * ",
      [
        id,
        modifiedSettings.key_name_en,
        modifiedSettings.key_name_ar,
        modifiedSettings.value_en,
        modifiedSettings.value_ar,
      ]
    );
    return result.rows;
  }
};

export const deleteSettings = async (id: string) => {
  const isValidId = await pool.query("select * from settings where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query("delete from settings where id=$1", [id]);
    return result.rows;
  }
};
