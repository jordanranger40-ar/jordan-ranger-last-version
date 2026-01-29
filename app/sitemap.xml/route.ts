// app/sitemap.xml/route.ts
import pool from "@/app/models/db/lib/index"; // your DB pool

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

type SlugRow = { slug: string };

// Generic helper to fetch slugs by table/column/type
async function fetchSlugsByType(
  table: string,
  column: string,
  type: string
): Promise<SlugRow[]> {
  const sql = `SELECT slug FROM ${table} WHERE ${column} = $1`;
  try {
    const res = await pool.query<SlugRow>(sql, [type]);
    return res.rows;
  } catch (err) {
    console.error("fetchSlugsByType error:", err);
    return [];
  }
}

export async function GET() {
  const now = new Date();

  // Static pages
  const staticPages = [
    { url: `${SITE_URL}/`, lastModified: now },
    { url: `${SITE_URL}/about-jordan-ranger`, lastModified: now },
    { url: `${SITE_URL}/our-clients`, lastModified: now },
    { url: `${SITE_URL}/restaurant`, lastModified: now },
    { url: `${SITE_URL}/contact-us`, lastModified: now },
    { url: `${SITE_URL}/training-rooms`, lastModified: now },
    { url: `${SITE_URL}/tour-operators`, lastModified: now },
    { url: `${SITE_URL}/Orienteering`, lastModified: now },
    /* { url: `${SITE_URL}/expedition-activities`, lastModified: now },
    { url: `${SITE_URL}/Ranger-Camp-Activity`, lastModified: now },*/
  ];

  // Dynamic pages using Promise.all
  const accommodationTypes = ["cabins", "tents"];
  const activityTypes = ["indoor", "outdoor"];
  const trainingTypes = ["School Training", "Corporate Team Building"];

  const accommodations = (
    await Promise.all(
      accommodationTypes.map((t) => fetchSlugsByType("rooms", "room_type_en", t))
    )
  ).flat();

  const activities = (
    await Promise.all(
      activityTypes.map((t) => fetchSlugsByType("activities", "location_type_en", t))
    )
  ).flat();

  const trainings = (
    await Promise.all(
      trainingTypes.map((t) => fetchSlugsByType("training", "category_en", t))
    )
  ).flat();

  const accommodationUrls = accommodations.map((a) => ({
    url: `${SITE_URL}/accommodation/${a.slug}`,
    lastModified: now,
  }));

  const activityUrls = activities.map((a) => ({
    url: `${SITE_URL}/activities/${a.slug}`,
    lastModified: now,
  }));

  const trainingUrls = trainings.map((t) => ({
    url: `${SITE_URL}/training/${t.slug}`,
    lastModified: now,
  }));

  const urls = [...staticPages, ...accommodationUrls, ...activityUrls, ...trainingUrls];

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (u) => `
  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastModified.toISOString()}</lastmod>
  </url>`
    )
    .join("")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
