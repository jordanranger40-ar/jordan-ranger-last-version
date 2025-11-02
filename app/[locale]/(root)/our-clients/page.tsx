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
          <div  key={client.id} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md justify-center hover:scale-105 transition-transform duration-200">
            <img
              src={client.logo} /></div>
        ))}
      </div>

    </main>
  );
}
