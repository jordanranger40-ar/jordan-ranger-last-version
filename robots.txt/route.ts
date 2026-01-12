export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://jordanranger.com";

  const content = `User-agent: *
Allow: /

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml
Host: ${siteUrl}
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
