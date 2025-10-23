"use client";

import { Inter, Cairo } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700"] });

export default function FontSwitcher({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const fontClass = locale === "ar" ? cairo.className : inter.className;

  return <div className={fontClass}>{children}</div>;
}
