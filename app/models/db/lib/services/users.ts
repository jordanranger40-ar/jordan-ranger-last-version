import { pool } from "../index";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

import { newUser, modifiedUser, DBUser, userInfo } from "@/types/index";
const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const checkPassword = async (password: string, hashedPasword: string) => {
  const isMatch = await bcrypt.compare(password, hashedPasword);
  return isMatch;
};

export const register = async (newUser: newUser) => {
  const checkEmail = await pool.query("select * from users where email=$1 ", [
    newUser.email,
  ]);

  if (checkEmail.rows.length > 0) {
    return { data: null, message: "The Email Is Already Exist" };
  } else {
    const result = await pool.query<newUser>(
      "insert into users (first_name, last_name, email, password) values ($1,$2,$3,$4) returning *",
      [
        newUser.first_name,
        newUser.last_name,
        newUser.email,
        await hashPassword(newUser.password),
      ]
    );

    return { message: "registered successfully", data: result.rows };
  }
};

export const login = async (userInfo: userInfo) => {
  const result = await pool.query<DBUser>(
    "select * from users where users.email= $1",
    [userInfo.email]
  );

  const dbUser = result.rows[0];

  if (result.rows.length === 0) {
    return null;
  } else {
    const isMatch = await checkPassword(
      userInfo.password,
      result.rows[0].password
    );

    if (!isMatch) {
      return null;
    } else {
      const token = jwt.sign(
        {
          user_id: dbUser.id,
          role: dbUser.role,
          name: dbUser.first_name,
        },
        process.env.NEXTAUTH_SECRET as Secret,
        { expiresIn: "30d" }
      );
      return {
        id: dbUser.id,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name ?? null,
        email: dbUser.email,
        role: dbUser.role,
        token: token,
      };
    }
  }
};

export const editUser = async (id: string, modifiedUser: modifiedUser) => {
  const isVaild = await pool.query<modifiedUser>(
    "select * from users where id=$1",
    [id]
  );

  if (isVaild.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query<modifiedUser>(
      "update users set role= coalesce($2,role) where id= $1 returning *",
      [id, modifiedUser.role]
    );

    return result.rows;
  }
};

export const removeUser = async (id: string) => {
  const isVaild = await pool.query<modifiedUser>(
    "select * from users where id=$1",
    [id]
  );

  if (isVaild.rows.length === 0) {
    return null;
  } else {
    const result = await pool.query("delete from users where id=$1", [id]);

    return result.rows;
  }
};

export const getAllusers= async()=>{
  const result= await pool.query<DBUser>(
    "select * from users"
  ) 
  return result.rows
}

export const getUserById= async (id:string)=>{

  const result =await pool.query<DBUser>(
    "select * from users where users.id=$1",[id]
  )

  return result.rows
}