import { newBanner, newTraining, newCategory } from "@/types";
import { Banner } from "@/components/banner/banner";
import Bannercards from "../banner-cards/banner-cards";

type Props = {
  banners: newBanner[];
  locale: string;
  categories: newCategory[];
  trainingData: newTraining[];
};

export default function BannerSection({ banners, locale, categories, trainingData }: Props) {
  return (
    <section className="w-full h-full relative">
      <Banner
        banners={banners}
        locale={locale}
        categories={categories}
        trainingData={trainingData}
      />

      <section className="absolute -bottom-52 left-0 w-full justify-self-center h-80 flex justify-around z-40">
        <Bannercards />
      </section>
    </section>
  );
}
