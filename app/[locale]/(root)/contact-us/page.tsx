import React from 'react'
import {sendEmailAction} from "./(actions)/sendEmailAction"
import ContactSection from "@/components/contactUs/ContactUsForm"


interface Props {
  params: Promise <{locale:"en"|"ar"}>
}

async function page({params}:Props) {
  const locale= (await params).locale
  return (
    <div>
      <ContactSection locale={locale} action={sendEmailAction} />
    </div>
  )
}

export default page