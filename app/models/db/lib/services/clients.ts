import pool from "../index";
import { newClient } from "@/types/index";


export const addNewClient = async (newClient: newClient) => {
  const result = await pool.query<newClient>(
    "insert into clients (name, logo) values ($1,$2) returning * ",
    [newClient.name, newClient.logo]
  );

  return result.rows;
};

export const getAllClients = async () => {
  const result = await pool.query("select * from clients ");
  return result.rows;
};

export const editClients = async (id: string, modifiedClient: newClient) => {
  const isValidId = await pool.query("select * from clients where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query<newClient>(
      " update clients  set name = coalesce ($2,name ), logo = coalesce ($3,logo ) where id= $1 returning * ",
      [id, modifiedClient.name, modifiedClient.logo]
    );
    return result.rows;
  }
};


export const deleteClient = async (id: string) => {
  const isValidId = await pool.query("select * from clients where id=$1 ", [
    id,
  ]);
  if (isValidId.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query("delete from clients where id=$1", [id]);
    return result.rows;
  }
};
