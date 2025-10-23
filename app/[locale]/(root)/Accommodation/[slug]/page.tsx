import { getCaregoryByslug } from "@/app/models/db/lib/services/Accommodation";
import { getServiceByCategoryId } from "@/app/models/db/lib/services/services";
import { notFound } from "next/navigation";
import FlippingCard from "@/components/flippingcard/flippingcard";
import CardsWrapper from "@/components/wrappers/card-wrapper";


interface PageProps {
  params: { locale: string; slug: string | string[] };
}

export default async function ProductPage({ params }: PageProps) {
  const id = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const locale = params.locale;

  const category = await getCaregoryByslug(id);
  const categoryData = category[0];
  if (!categoryData) notFound();

  const services = await getServiceByCategoryId(category[0].id ?? "");

  const categoryName =
    locale === "ar"
      ? categoryData.category_name_ar
      : categoryData.category_name_en;
  const categoryDesc =
    locale === "ar" ? categoryData.description_ar : categoryData.description_en;

  const categoryImage = categoryData.image;

  return (
    <div className={` ${locale === "ar" ? "text-right" : "text-left"} mt-14`}>
      
    <section
      className="w-full h-[60vh] relative bg-fixed bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('${categoryImage}')` }}
    >
      <div className="bg-black/50 w-full h-full absolute top-0 flex justify-center items-center">
        <h2 className="text-white text-center  text-4xl font-bold">
          {categoryName}
        </h2>
      </div>
    </section>

      <section
        aria-label="Spacer"
        className="w-[75%] flex flex-col items-center justify-center justify-self-center"
      >
        <p className="mb-6">{categoryDesc}</p>
      </section>

      <CardsWrapper>
        {services.map((service) => {
          const serviceName =
            locale === "ar" ? service.name_ar : service.name_en;
          const serviceDesc =
            locale === "ar" ? service.description_ar : service.description_en;

            const serviceImage = service.image;

          return (
            <FlippingCard
              key={service.id}
              title={serviceName}
              description={serviceDesc}
              image={serviceImage}
            />
          );
        })}
      </CardsWrapper>
    </div>
  );
}
