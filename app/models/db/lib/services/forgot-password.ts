import pool from "../index";
import crypto from "crypto";
import { user } from "@/types/index";


export const generateToken = async (email: string) => {
  const user = await pool.query<user>(
    "select * from users where users.email=$1",
    [email]
  );

  if (user.rows.length === 0) return null;

  const token: string = crypto.randomBytes(36).toString("hex");
  const expires_at: Date = new Date(Date.now() + 1000 * 60 * 60);

  await pool.query("DELETE FROM reset_password_token WHERE user_id = $1", [
    user.rows[0].id,
  ]);

  await pool.query(
    "insert into reset_password_token (user_id, token,expires_at) values ($1,$2,$3) ",
    [user.rows[0].id, token, expires_at]
  );

  return token;
};
