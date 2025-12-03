import { newBanner} from "@/types";
import { Banner } from "@/components/banner/banner";
import Bannercards from "../banner-cards/banner-cards";

type Props = {
  banners: newBanner[];
  locale: string;
  isThereComingSoon:boolean

};

export default function BannerSection({ banners, locale, isThereComingSoon }: Props) {
  return (
    <section className="w-full h-full relative">
      <Banner
        banners={banners}
        locale={locale}
        isThereComingSoon={isThereComingSoon}

      />

      <section className="lg:absolute lg:-bottom-52 lg:left-0 w-full justify-self-center lg:h-80 flex justify-around lg:z-40 mt-10 lg:mt-0">
        <Bannercards />
      </section>
    </section>
  );
}
