import { getAllClients } from "@/app/models/db/lib/services/clients";
import HeaderSection from "@/components/our-clients/headerSection";

type Client = {
  id?: string;
  name: string;
  logo: string;
  created_at?: Date;
};

interface PageProps {
  params: {
    locale: string;
  };
}

export default async function OurClients({ params }: PageProps) {
  const { locale } = params;
  const isArabic = locale === "ar";

  const clients: Client[] = await getAllClients();

  return (
    <main className="flex flex-col items-center mt-12 w-full">
      <HeaderSection isArabic={isArabic} />

      <div className="w-full max-w-6xl px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {clients.map((client) => (
          <div
            key={client.id} 
            className="flex justify-center items-center overflow-hidden group transition-transform duration-500 transform-gpu hover:-translate-y-2 p-3 hover:shadow-[0_12px_25px_rgba(0,0,0,0.25)]"
            style={{
              borderRadius: "2rem 0.5rem 2rem 0.5rem",
              boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
            }}
          >
            <img src={client.logo} alt={client.name} className="w-full h-auto object-contain" />
          </div>
        ))}
      </div>
    </main>
  );
}
