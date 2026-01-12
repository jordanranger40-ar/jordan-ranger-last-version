import type { Metadata } from "next";
import { env } from "process";

export const AppName = env.NEXT_PUBLIC_RANGER_APP_NAME || "Jordan Ranger Camp";

export const APP_DESCRIPTION =
  env.NEXT_PUBLIC_RANGER_APP_DESCRIPTION ||
  "Jordan Ranger Camp is an eco-friendly retreat near Jerash combining outdoor adventure, training, and nature conservation. Stay in cabins, tents or stone caves and enjoy activities like zipline, horseback riding and Orienteering training.";

const SERVER_URL = env.NEXT_PUBLIC_APP_URL || "https://jordanranger.example.com";

// Bilingual keywords commonly useful across site
export const COMMON_KEYWORDS = [
  "Jordan Ranger",
  "Jordan Ranger Camp",
  "Ranger Camp Jerash",
  "eco camp Jordan",
  "eco-friendly retreat",
  "outdoor adventure Jordan",
  "orienteering training",
  "zipline Jordan",
  "horseback riding Jerash",
  "team building Jordan",
  "school trips Jordan",
  "cabins Jordan",
  "tents Jordan",
  "forest resort Jerash",
  "Al Kuroom restaurant",
  "sustainable tourism Jordan",
  "Jordan tourism",
  // Arabic keywords
  "مخيم رينجر الأردن",
  "مخيم رينجر جرش",
  "مخيم صديق للبيئة",
  "مغامرات في الهواء الطلق",
  "تدريب التوجيه (orienteering)",
  "حبل عالي (حوائط الحبال)",
  "التخييم في الخيام",
  "إقامة في الكابينات",
  "تجارب سياحية في جرش",
  "رحلات مدرسية الأردن",
] as const;

// Page-specific metadata map
export const PAGE_METADATA: Record<string, Metadata> = {
  home: {
    title: "Jordan Ranger Camp — Eco Retreat & Adventure near Jerash",
    description:
      "Jordan Ranger Camp is an eco-friendly forest resort and training center near Jerash. Experience cabins, stone caves, tents, or unique treehouse lodging with adventure activities and professional Orienteering training.",
    keywords: COMMON_KEYWORDS.join(", "),
    openGraph: {
      title: "Jordan Ranger Camp — Adventure & Eco Retreat",
      description:
        "Eco-friendly lodging, adventure activities, and Orienteering training near the Roman ruins of Jerash.",
      type: "website",
      images: [
        {
          url: `${SERVER_URL}/logo2.png`,
          width: 1200,
          height: 630,
          alt: "Jordan Ranger Camp - Home",
        },
      ],
    },
  },

  about: {
    title: "About Jordan Ranger Camp — History & Conservation",
    description:
      "Founded in 2006 near Thaghret Asfour, Jordan Ranger Camp blends adventure tourism with nature conservation and community projects supporting Jerash heritage tourism.",
    keywords: [...COMMON_KEYWORDS, "about Jordan Ranger", "camp history"].join(", "),
    openGraph: {
      title: "About Jordan Ranger Camp",
      description:
        "Learn about Jordan Ranger Camp's mission: eco-tourism, training, and community partnerships near Jerash.",
      type: "website",
      images: [
        {
          url: `${SERVER_URL}/logo2.png`,
          width: 1200,
          height: 630,
          alt: "About Jordan Ranger Camp",
        },
      ],
    },
  },

  "training/corporate-team-building": {
    title: "Corporate Team Building — Jordan Ranger Camp",
    description:
      "Corporate team-building programs at Jordan Ranger Camp combine challenge-based adventure (zipline, ropes courses) with soft-skills training in a nature setting near Jerash.",
    keywords: [...COMMON_KEYWORDS, "corporate team building", "team building Jordan"].join(
      ", "
    ),
    openGraph: {
      title: "Corporate Team Building — Jordan Ranger Camp",
      description:
        "Outdoor team-building activities, leadership challenges and tailored corporate programs near Jerash.",
      type: "website",
      images: [
        {
          url: `${SERVER_URL}/logo2.png`,
          width: 1200,
          height: 630,
          alt: "Corporate Team Building - Jordan Ranger",
        },
      ],
    },
  },

  "training/schools-training": {
    title: "Schools Training — Jordan Ranger Camp",
    description:
      "School trip programs focusing on life-skills, outdoor education and Orienteering offered by Jordan Ranger Camp — safe, educational and adventure-driven.",
    keywords: [...COMMON_KEYWORDS, "school trips", "outdoor education"].join(", "),
    openGraph: {
      title: "Schools Training — Jordan Ranger Camp",
      description:
        "Educational school programs combining outdoor skills, Orienteering and experiential learning.",
      type: "website",
      images: [
        {
          url: `${SERVER_URL}/og/training-schools.jpg`,
          width: 1200,
          height: 630,
          alt: "Schools Training - Jordan Ranger",
        },
      ],
    },
  },

  "activities/indoor-activities": {
    title: "Indoor Activities — Jordan Ranger Camp",
    description:
      "Indoor skill-building sessions, workshops and simulated challenges hosted at Jordan Ranger Camp as part of its training and team-building offerings.",
    keywords: [...COMMON_KEYWORDS, "indoor activities", "workshops"].join(", "),
    openGraph: {
      title: "Indoor Activities — Jordan Ranger Camp",
      description:
        "Workshops and indoor training sessions for teams, schools and trainees.",
      type: "website",
      images: [
        {
          url: `${SERVER_URL}/logo2.png`,
          width: 1200,
          height: 630,
          alt: "Indoor Activities - Jordan Ranger",
        },
      ],
    },
  },

  "activities/outdoor-activities": {
    title: "Outdoor Activities — Jordan Ranger Camp",
    description:
      "Zipline, tower climbing, ropes courses, horseback riding and Orienteering — adventurous outdoor activities at Jordan Ranger Camp near Jerash.",
    keywords: [...COMMON_KEYWORDS, "outdoor activities", "zipline", "horseback riding"].join(
      ", "
    ),
    openGraph: {
      title: "Outdoor Activities — Jordan Ranger Camp",
      description:
        "Thrilling outdoor adventures including zipline, climbing and Orienteering training.",
      type: "website",
      images: [
        {
          url: `${SERVER_URL}/logo2.png`,
          width: 1200,
          height: 630,
          alt: "Outdoor Activities - Jordan Ranger",
        },
      ],
    },
  },

  "accommodation/cabins": {
    title: "Cabins — Accommodation at Jordan Ranger Camp",
    description:
      "Stay in eco-friendly wooden cabins at Jordan Ranger Camp — some built around living trees — offering a unique forest lodging experience near Jerash.",
    keywords: [...COMMON_KEYWORDS, "cabins", "eco cabins", "forest lodging"].join(", "),
    openGraph: {
      title: "Cabins — Jordan Ranger Camp Accommodation",
      description:
        "Wooden cabin accommodation, rustic comfort and eco-design in a forest retreat near Jerash.",
      type: "website",
      images: [
        {
          url: `${SERVER_URL}/logo2.png`,
          width: 1200,
          height: 630,
          alt: "Cabins - Jordan Ranger",
        },
      ],
    },
  },

  "accommodation/tents": {
    title: "Tents — Accommodation at Jordan Ranger Camp",
    description:
      "Traditional camping tent accommodation at Jordan Ranger Camp — a back-to-nature experience ideal for groups and school trips near Jerash.",
    keywords: [...COMMON_KEYWORDS, "tents", "camping", "group camping"].join(", "),
    openGraph: {
      title: "Tents — Jordan Ranger Camp Accommodation",
      description:
        "Camp under the trees in tents at Jordan Ranger Camp with guided activities and onsite facilities.",
      type: "website",
      images: [
        {
          url: `${SERVER_URL}/logo2.png`,
          width: 1200,
          height: 630,
          alt: "Tents - Jordan Ranger",
        },
      ],
    },
  },

  restaurant: {
    title: "Al Kuroom Restaurant — Local Cuisine at Jordan Ranger Camp",
    description:
      "Al Kuroom at Jordan Ranger Camp serves traditional dishes made from locally sourced ingredients and offers cooking sessions for guests.",
    keywords: [...COMMON_KEYWORDS, "restaurant", "local cuisine", "Al Kuroom"].join(", "),
    openGraph: {
      title: "Al Kuroom — Jordan Ranger Camp Restaurant",
      description:
        "Experience local Jordanian cuisine at Al Kuroom restaurant in Jordan Ranger Camp, using locally sourced ingredients.",
      type: "website",
      images: [
        {
          url: `${SERVER_URL}/logo2.png`,
          width: 1200,
          height: 630,
          alt: "Al Kuroom Restaurant - Jordan Ranger",
        },
      ],
    },
  },
};

// Dynamic metadata generator for training/activity/accommodation items
export const generateDynamicMetadata = {
  page: (page: {
    type: "training" | "activity" | "accommodation";
    name: string;
    description?: string;
    slug: string;
    parent?: string;
  }): Metadata => {
    const defaultDescriptions: Record<string, string> = {
      training: `${page.name} training at Jordan Ranger Camp — professional courses in Orienteering, life-skills and team-building near Jerash.`,
      activity: `${page.name} at Jordan Ranger Camp — outdoor adventure activity in the Jerash forest resort.`,
      accommodation: `${page.name} accommodation at Jordan Ranger Camp — eco-friendly lodging near Jerash.`,
    };

    const description = page.description || defaultDescriptions[page.type];

    const keywords: string[] = [
      "Jordan Ranger",
      page.name,
      `${page.name} ${page.type}`,
      page.type === "training" ? "training" : "activity",
      "Jerash",
      "Jordan",
      "eco camp",
    ];

    if (page.type === "training") {
      keywords.push("orienteering", "life skills", "team building");
    }
    if (page.type === "activity") {
      keywords.push("zipline", "horseback riding", "ropes course");
    }
    if (page.type === "accommodation") {
      keywords.push("cabins", "tents", "forest lodging");
    }

    return {
      title: `${page.name} | ${page.type === "training" ? "Training" : page.type === "activity" ? "Activity" : "Accommodation"} - ${AppName}`,
      description,
      keywords: keywords.concat(Array.from(COMMON_KEYWORDS)).join(", "),
      openGraph: {
        title: `${page.name} | ${AppName}`,
        description,
        type: "website",
        siteName: AppName,
        images: [
          {
            url: `${SERVER_URL}/${page.slug || "logo2"}.jpg`,
            width: 1200,
            height: 630,
            alt: page.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${page.name} | ${AppName}`,
        description,
        images: [`${SERVER_URL}/${page.slug || "logo2"}.jpg`],
      },
    };
  },
};

// Base metadata used across site
export const baseMetadata: Metadata = {
  metadataBase: new URL(SERVER_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: AppName,
    images: [
      {
        url: `${SERVER_URL}/logo2.png`,
        width: 1200,
        height: 630,
        alt: AppName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@JordanRanger",
    creator: "@JordanRanger",
    images: [`${SERVER_URL}/logo2.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "PUT-GOOGLE-VERIFICATION-HERE",
  },
};

// Helper to merge / extend metadata when needed
export const createMetadata = (pageMetadata: Metadata): Metadata => {
  const merged: Metadata = { ...baseMetadata, ...pageMetadata };
  if (merged.openGraph) {
    merged.openGraph = { ...merged.openGraph, siteName: AppName };
  }
  return merged;
};

export const ROOT_METADATA: Metadata = {
  title: { default: AppName, template: `%s - ${AppName}` },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
  icons: {
    icon: `${SERVER_URL}/favicon.ico`,
    shortcut: `${SERVER_URL}/favicon.ico`,
    apple: `${SERVER_URL}/favicon.ico`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: AppName,
    description: APP_DESCRIPTION,
    siteName: AppName,
    url: SERVER_URL,
    images: [
      {
        url: `${SERVER_URL}/logo2.png`,
        width: 1200,
        height: 630,
        alt: AppName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@JordanRanger",
    creator: "@JordanRanger",
    title: AppName,
    description: APP_DESCRIPTION,
    images: [`${SERVER_URL}/logo2.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};
