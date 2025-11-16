import Footer from "@/components/ui/footer";
import Header from "@/components/header";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

import { getAllcategories } from "@/app/models/db/lib/services/Accommodation";
import { getAllTraining } from "@/app/models/db/lib/services/training";

import FontSwitcher from "@/components/fontswitcher/FontSwitcher";
import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  const [categories, trainingData] = await Promise.all([
    getAllcategories(),
    getAllTraining(),
  ]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <FontSwitcher locale={locale}>
        <div className="flex flex-col min-h-screen bg-[#f1f1f1]">
      
          <section
            aria-label="Header"
            className="fixed w-full top-0 left-0 right-0 backdrop-blur-sm z-50 bg-[#333] dark:bg-[#020618]"
          >
            <Header />
          </section>

          <main className="flex-1">{children}</main>

       
          <Footer />

          <Toaster
            position="bottom-right"
            richColors
            
          
            duration={3000}
          />
        </div>
      </FontSwitcher>
    </NextIntlClientProvider>
  );
}
