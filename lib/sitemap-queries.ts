// lib/sitemap-queries.ts
import pool from "@/app/models/db/lib/index"; 
type SlugRow = { slug: string };

async function fetchSlugsByType(
  table: string,
  column: string,
  types: string[]
): Promise<SlugRow[]> {
  if (!types || types.length === 0) return [];

  if (!/^[a-zA-Z0-9_]+$/.test(table) || !/^[a-zA-Z0-9_]+$/.test(column)) {
    throw new Error("Invalid table or column name");
  }

  const sql = `
    SELECT slug
    FROM ${table}
    WHERE ${column} = ANY($1::text[])
  `;

  const res = await pool.query<SlugRow>(sql, [types]);
  return res.rows;
}

// Now use Promise.all to fetch all types
export async function fetchJordanRangerSlugs() {
  const queries = [
    { table: "rooms", column: "room_type_en", types: ["cabins", "tents"], prefix: "Accommodation" },
    { table: "activities", column: "location_type_en", types: ["indoor", "outdoor"], prefix: "activities" },
    { table: "training", column: "category_en", types: ["Schools Training", "Corporate Team Building"], prefix: "training" },
  ];

  const results = await Promise.all(
    queries.map(async (q) => {
      const slugs = await fetchSlugsByType(q.table, q.column, q.types);
      // Map slugs with the URL prefix
      return slugs.map((s) => ({ url: `/${q.prefix}/${s.slug}` }));
    })
  );

  // Flatten array of arrays
  return results.flat();
}
