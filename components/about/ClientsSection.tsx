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
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full py-10 px-4 sm:px-8 mt-20 bg-[#2f2f2f] text-center"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 tracking-tight">
        {isArabic ? "شركاؤنا" : "Our Clients"}
      </h2>

      <div className="w-16 h-[2px] bg-white/50 mx-auto mb-8 rounded-full"></div>

      <div className="max-w-6xl mx-auto">
        <ClientsCarousel clients={clients} />
      </div>
    </section>
  );
}
