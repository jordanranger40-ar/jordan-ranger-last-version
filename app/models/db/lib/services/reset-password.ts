import pool from "../index";
import bcrypt from "bcrypt";
import { resetToken } from "@/types/index";
import { users } from "@/types/index";


const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const checkPassword = async (
  enteredPassword: string,
  currentPassword: string
) => {
  const isMatch = bcrypt.compare(enteredPassword, currentPassword);
  return isMatch;
};

export const resetPassword = async (token: string, newPassword: string) => {
  if (!token || !newPassword) {
    return { result: null, message: "Invaild Request" };
  }

  const resetToken = await pool.query<resetToken>(
    "select * from reset_password_token where reset_password_token.token=$1 AND expires_at > NOW()",
    [token]
  );

  if (resetToken.rows.length === 0) {
    return { result: null, message: "Invaild Token" };
  }

  const result = await pool.query(
    "update users set password= $1 where users.id=$2",
    [await hashPassword(newPassword), resetToken.rows[0].user_id]
  );

  await pool.query("DELETE FROM reset_password_token WHERE token = $1", [
    token,
  ]);

  return { result: true, message: "Password has been reset successfully" };
};

export const changePassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await pool.query<users>("select * from users where users.id=$1", [
    id,
  ]);

  const isMatch = await checkPassword(oldPassword, user.rows[0].password);

  if (isMatch === true) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatePassword = await pool.query(
      "update users set password= $1 returning *",
      [hashedPassword]
    );
    return {
      result: updatePassword.rows[0],
      message: "Password Has Been Updated Successfully",
      status:201
    };
  } else {
    return { result: null, message: "Password is Not Correct" ,status:500};
  }
};
