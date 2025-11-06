import React from "react";

interface Props {
  isArabic: boolean;
}

export default function outdoorActivitiesHeader({ isArabic }: Props) {
  return (
    <section
      className="w-full h-[60vh] relative bg-fixed bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('/images/about.jpg')` }}
    >
      <div className="bg-black/50 w-full h-full absolute top-0 flex justify-center items-center">
        <h2 className="text-white text-center  text-4xl font-bold">
          {isArabic ? "الفعاليات الخارجية " : "outdoor Activities"}
        </h2>
      </div>
    </section>
  );
}
