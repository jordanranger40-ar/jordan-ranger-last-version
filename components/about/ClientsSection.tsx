import React from "react";
import ClientsCarousel from "@/components/ClientsCarousel/ClientsCarousel";

interface Client {
  id?: string;
  name: string;
  logo: string;
  created_at?: Date;
}

interface Props {
  clients: Client[];
  isArabic: boolean;
}

export default function ClientsSection({ clients, isArabic }: Props) {
  return (
    <section
      className={` mx-auto mt-32  ${isArabic ? "text-right" : "text-center"} bg-[#515151] `}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <h2 className="text-5xl font-extrabold text-white text-center " >
        {isArabic ? "شركاؤنا" : "Our Clients"}
      </h2>
      <ClientsCarousel clients={clients} />
    </section>
  );
}
