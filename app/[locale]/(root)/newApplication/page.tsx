import React from "react";
import NewApplicationForm from "@/components/careers/newApplicationForm";
import { newApplication } from "./(fetch)/newApplication";

type Props = {
  params: Promise<{ locale: string }>;
};

async function page({ params }: Props) {
  const { locale } = await params;
  return (
    <div>
      <NewApplicationForm action={newApplication} locale={locale} />
    </div>
  );
}

export default page;
