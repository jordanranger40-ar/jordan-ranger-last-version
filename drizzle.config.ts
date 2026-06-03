import type { Config } from "drizzle-kit";

export default {
  schema: "./dbSchemas/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING!,
  },
} satisfies Config;


// Note that: i am using drizzle just for saving the database schemas, the quries are written in SQL
// this path:  ./dbSchemas/schema.ts has the last updated schema, you can build the database using this command: 'npx drizzle-kit push', but make sure to add the db connection string in the .env
// if you want to do any changes on database, do it from neon, not from drizzle, and after updating the database, use this command:'npx drizzle-kit pull' to pull the updated db schema

