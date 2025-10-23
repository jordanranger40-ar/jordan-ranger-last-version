import { getCourseById } from "@/app/models/db/lib/services/courses";
import Image from "next/image";
import { getTrainingById } from "@/app/models/db/lib/services/training";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CardsWrapper from "@/components/wrappers/card-wrapper";

interface PageProps {
  params: { locale: string; id: string | string[] };
}

export default async function ProductPage({ params }: PageProps) {
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const locale = params.locale;

  const training = await getTrainingById(id);
  const trainingData = training[0];
  if (!trainingData) notFound();

  const courses = await getCourseById(id);

  const trainingName =
    locale === "ar" ? trainingData.name_ar : trainingData.name_en;
  const trainingDesc =
    locale === "ar"
      ? trainingData.description_ar
      : trainingData.description_en;

  return (
    <div className={`p-6 ${locale === "ar" ? "text-right" : "text-left"}`}>
      <section className="w-full md:w-3/4 mx-auto flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-4 mt-20">{trainingName}</h1>
        <p className="mb-6 text-gray-600 max-w-2xl">{trainingDesc}</p>
      </section>

      <CardsWrapper>
        {courses.map((course) => {
          const title = locale === "ar" ? course.title_ar : course.title_en;
          const description =
            locale === "ar" ? course.description_ar : course.description_en;
          const duration =
            locale === "ar" ? course.duration_ar : course.duration_en;
          const audience =
            locale === "ar"
              ? course.target_audience_ar
              : course.target_audience_en;
          const delivery =
            locale === "ar"
              ? course.delivery_method_ar
              : course.delivery_method_en;
          const image = course.image || "/default-course.jpg";

          return (
            <Card
              key={course.id}
              className={`shadow-xl bg-white border border-gray-200 rounded-xl hover:shadow-2xl transition-shadow min-h-[440px] flex flex-col relative overflow-hidden group ${
                locale === "ar" ? "text-right" : "text-left"
              }`}
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#125892]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 z-0" />

              <div className="w-full h-48 relative z-10">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-between flex-1 p-6 z-10">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-bold text-[#125892] mb-2">
                    {title}
                  </CardTitle>
                  <CardContent className="text-gray-600 line-clamp-3 p-0 text-sm">
                    {description}
                  </CardContent>
                </CardHeader>

                <CardContent className="p-0 mt-4 space-y-2 text-sm text-gray-700">
                  {audience?.length > 0 && (
                    <p>
                      <span className="font-semibold text-gray-800">
                        {locale === "ar" ? "الفئة المستهدفة" : "Audience"}:
                      </span>{" "}
                      {audience.join(", ")}
                    </p>
                  )}
                  {delivery?.length > 0 && (
                    <p>
                      <span className="font-semibold text-gray-800">
                        {locale === "ar" ? "طريقة التقديم" : "Delivery"}:
                      </span>{" "}
                      {delivery.join(", ")}
                    </p>
                  )}
                  {duration && (
                    <p>
                      <span className="font-semibold text-gray-800">
                        {locale === "ar" ? "المدة" : "Duration"}:
                      </span>{" "}
                      {duration}
                    </p>
                  )}
                </CardContent>
              </div>
            </Card>
          );
        })}
      </CardsWrapper>
    </div>
  );
}
