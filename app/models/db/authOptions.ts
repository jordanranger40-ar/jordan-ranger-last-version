import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { login, register } from "./lib/services/users";
import pool from "./lib/index";
import { userDetails } from "@/types";

interface User {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  password?: string;
  role: string;
  token: string;
}

declare module "next-auth" {
  interface User {
    id: string;
    firstName: string;
    lastName?: string | null;
    email: string;
    password?: string;
    role: string;
    token: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    role: string;
    email: string;
    token: string;
  }
}

export const authOptions: NextAuthOptions = {
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials!;
        if (!email || !password) return null;

        const result = await login({ email, password });
        if (!result) return null;

        return {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          role: result.role,
          token: result.token,
        } as User;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // ✅ Handles JWT creation and updates
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === "google") {
          const firstName = user.name?.split(" ")[0] || "";
          const lastName = user.name?.split(" ")[1] || "";

          // Fetch user from DB
          let dbUser = (
            await pool.query<userDetails>(
              "SELECT * FROM users WHERE email=$1",
              [user.email]
            )
          ).rows[0];

          // If not exists, register
          if (!dbUser) {
            const registerResult = await register({
              first_name: firstName,
              last_name: lastName,
              email: user.email!,
              password: crypto.randomUUID(),
            });

            if (!registerResult.data || registerResult.data.length === 0) {
              throw new Error("Failed to register Google user");
            }

            dbUser = registerResult.data[0];
          }

          // Use DB user ID and role
          const backendToken = jwt.sign(
            {
              user_id: dbUser.id,
              role: dbUser.role,
              name: firstName,
            },
            process.env.NEXTAUTH_SECRET as string,
            { expiresIn: "30d" }
          );

          token.id = dbUser.id ?? "";
          token.firstName = firstName;
          token.role = dbUser.role;
          token.token = backendToken;
        } else {
          // Credentials provider
          token.id = user.id;
          token.firstName = user.firstName;
          token.role = user.role;
          token.token = user.token;
        }
      }
      return token;
    },

    // ✅ Always fetches latest role from DB
    async session({ session, token }) {
      if (session.user) {
        try {
          console.log("token: ", token.id);

          const result = await pool.query<userDetails>(
            "SELECT * FROM users WHERE email = $1",
            [token.email]
          );

          const latestRole = result.rows[0]?.role || token.role;
          const dbId = result.rows[0].id || token.id;

          session.user.id = dbId;
          session.user.firstName = token.firstName;
          session.user.role = latestRole;
          session.user.token = token.token;
        } catch (err) {
          console.error("Error fetching user role:", err);
          // fallback to old token role
          session.user.role = token.role;
        }
      }
      return session;
    },
  },

  // ✅ Ensure Google users exist in DB
  events: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [user.email]
          );

          if (existingUser.rows.length === 0) {
            await register({
              first_name: user.name?.split(" ")[0] || "",
              last_name: user.name?.split(" ")[1] || "",
              email: user.email!,
              password: crypto.randomUUID(), // random password for Google users
            });
          }
        } catch (err) {
          console.error("Error registering Google user:", err);
        }
      }
    },
  },
};
